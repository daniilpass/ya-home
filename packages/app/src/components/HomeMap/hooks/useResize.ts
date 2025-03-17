import {RefObject, useState, useLayoutEffect, useCallback, useRef} from 'react';

import { MouseButton, Point } from '@homemap/shared';

import {DragEvent, useDrag} from './useDrag';
import { usePinchScale } from './usePinchScale';

const WHEEL_EVENT = 'wheel';
const MIN_SCALE = 0.125;
const MAX_SCALE = 4;
const SCALE_FACTOR = 0.1;
const PINCH_SCALE_FACTOR = 0.025;

type DragOptions = { 
    scale: number,
    translate: Point,
}

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    layoutRef: RefObject<SVGSVGElement>,
    configuration?: {
        allowScale?: boolean,
        allowInitialScale?: boolean,
        allowRotate?: boolean,
        allowInitialRotate?: boolean,
        allowZoom?: boolean;
        allowMove?: boolean;
        allowDrag?: boolean;
        naturalWidth: number;
        naturalHeight: number;
    }
) => {
    const [scale, setScale] = useState(1.0);
    const [minScale, setMinScale] = useState(MIN_SCALE);
    const [rotate, setRotate] = useState(0);
    const [translate, setTranslate] = useState<Point>([0, 0]);
    const {
        allowScale = false,
        allowInitialScale = false,
        allowRotate = false,
        allowInitialRotate = false,
        allowZoom = false,
        allowDrag = false,
        naturalWidth = 1,
        naturalHeight = 1,
    } = configuration || {};

    const handleResize = useCallback((allowScale: boolean, allowRotate: boolean, wrapper: HTMLElement) => {   
        const rotate = allowRotate && wrapper.offsetHeight > wrapper.offsetWidth ? 90 : 0;
        const scale = Math.min(
            wrapper.offsetWidth / (rotate === 0 ? naturalWidth : naturalHeight),
            wrapper.offsetHeight / (rotate === 0 ? naturalHeight : naturalWidth),
        );
        if (allowRotate) {
            setRotate(rotate);
        };

        if (allowScale) {
            setScale(scale);
            !allowZoom && setMinScale(scale);
        }
    }, [allowZoom, naturalHeight, naturalWidth])

    // Scale'n'Rotate initial
    useLayoutEffect(() => {
        const hookDisabled = !allowInitialScale && !allowInitialRotate;
        const wrapper = wrapperRef.current;

        if (hookDisabled || !wrapper) {
            return;
        }

        handleResize(allowInitialScale, allowInitialRotate, wrapper);

    }, [allowInitialScale, allowInitialRotate, wrapperRef, handleResize]);

    // Scale'n'Rotate observer
    useLayoutEffect(() => {
        const hookDisabled = !allowScale && !allowRotate;
        const wrapper = wrapperRef.current;

        if (hookDisabled || !wrapper) {
            return;
        }

        const onResize = () => handleResize(allowScale, allowRotate, wrapper);
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(wrapper);

        return () => {
            resizeObserver.unobserve(wrapper)
        }
    }, [allowScale, allowRotate, wrapperRef, handleResize]);

    // Zoom
    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if(!allowZoom || !wrapper){
            return;
        }

        const handleZoom = (e: any) => {
            const delta = Math.sign(e.deltaY) * scale * SCALE_FACTOR;
            const newScale = Math.min(Math.max(minScale, scale - delta), MAX_SCALE);
            setScale(newScale);
        }
        
        wrapper.addEventListener(WHEEL_EVENT, handleZoom, { passive: true });

        return () => {
            wrapper.removeEventListener(WHEEL_EVENT, handleZoom);
        }
    }, [wrapperRef, scale, minScale, allowZoom]);

    // Drag
    const onDrag = useCallback((e: DragEvent, options: DragOptions) => {
        setTranslate([
            options.translate[0] - (e.pageXDiff / options.scale),
            options.translate[1] - (e.pageYDiff / options.scale),
        ]);
    }, []);

    const onDragStart = useDrag({ onDrag, strict: true });

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const layout = layoutRef.current;

        if(!allowDrag || !wrapper|| !layout){
            return;
        }

        const handleDragStart = (e: PointerEvent) => {
            onDragStart(e, { scale, translate });
        }
        
        wrapper.addEventListener('pointerdown', handleDragStart);
        layout.addEventListener('pointerdown', handleDragStart);

        return () => {
            wrapper.removeEventListener('pointerdown', handleDragStart);
            layout.removeEventListener('pointerdown', handleDragStart);
        }
    }, [allowDrag, wrapperRef, layoutRef, onDragStart, scale, translate])


    /**
     * Pinch
     */
    const pinchScale = useRef<number>(0);

    const onPinchScaleStart = useCallback(() => {
        pinchScale.current = scale;
    }, [scale]);

    const onPinchScale = useCallback((direction: string, distance: number) => {
        const scale = pinchScale.current; // hide state
        const sign = direction === 'up' ? -1 : 1;
        const delta = sign * scale * PINCH_SCALE_FACTOR;
        const newScale = Math.min(Math.max(minScale, scale - delta), MAX_SCALE);

        pinchScale.current = newScale;
        setScale(newScale);

    }, [minScale]);

    usePinchScale(wrapperRef, layoutRef, onPinchScale, onPinchScaleStart);

    return [scale, rotate, translate] as const;
}
