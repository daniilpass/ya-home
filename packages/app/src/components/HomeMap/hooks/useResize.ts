import {RefObject, useState, useLayoutEffect, MouseEvent as ReactMouseEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';

import {DragEvent, useDrag} from './useDrage';

const WHEEL_EVENT = 'wheel';
const MIN_SCALE = 0.125;
const MAX_SCALE = 4;
const SCALE_FACTOR = 0.1;

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    layoutRef: RefObject<HTMLDivElement>,
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
    const [translate, setTranslate] = useState<[number, number]>([0, 0]);

    const onDrag = ({ pageX, pageY }: DragEvent, _scale: number) => {
        if (!wrapperRef.current) {
            return;
        }
        const bounds = wrapperRef.current.getBoundingClientRect();
        const x = (pageX - bounds.left - bounds.width / 2) / _scale;
        const y = (pageY - bounds.top - bounds.height / 2) / _scale;

        setTranslate([x, y]);
    }
    const onDragStart = useDrag(onDrag, MouseButton.MIDDLE);

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
    useLayoutEffect(() => {
        const wrapper = layoutRef.current;
        if(!allowDrag || !wrapper){
            return;
        }

        const handleDragStart = (e: MouseEvent) => onDragStart(e, scale);
        
        wrapper.addEventListener('mousedown', handleDragStart);

        return () => {
            wrapper.removeEventListener('mousedown', handleDragStart);
        }
    }, [allowDrag, layoutRef, scale])

    return [scale, rotate, translate] as const;
}
