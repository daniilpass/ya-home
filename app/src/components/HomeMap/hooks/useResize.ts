import {RefObject, useState, useLayoutEffect, MouseEvent as ReactMouseEvent, useCallback} from 'react';
import {useDrag} from './useDrage';
import { MouseButton } from '../../../common/types';

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
    const [rotateDegree, setRotateDegree] = useState(0);
    const [translate, setTranslate] = useState<[number, number]>([0, 0]);

    const onDrag = (pageX: number, pageY: number, _scale: number) => {
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
        allowScale = true,
        allowInitialScale = true,
        allowRotate = true,
        allowInitialRotate = true,
        allowZoom = false,
        allowDrag = false,
        naturalWidth = 1,
        naturalHeight = 1,
    } = configuration || {};

    const handleResize = useCallback((allowScale: boolean, allowRotate: boolean, wrapper: HTMLElement) => {   
        const rotateDegree = allowRotate && wrapper.offsetHeight > wrapper.offsetWidth ? 90 : 0;
        const scale = Math.min(
            wrapper.offsetWidth / (rotateDegree === 0 ? naturalWidth : naturalHeight),
            wrapper.offsetHeight / (rotateDegree === 0 ? naturalHeight : naturalWidth),
        );
        console.log('HELLO', {
            offsetWidth: wrapper.offsetWidth,
            offsetHeight: wrapper.offsetHeight,
            naturalWidth,
            naturalHeight
        })
        if (allowRotate) {
            setRotateDegree(rotateDegree);
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
        
        wrapper.addEventListener(WHEEL_EVENT, handleZoom);

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

        const handleDrag = (e: MouseEvent | ReactMouseEvent<Element, MouseEvent>) =>
            onDragStart(e as ReactMouseEvent<Element, MouseEvent>, scale);
        
        wrapper.addEventListener('mousedown', handleDrag);

        return () => {
            wrapper.removeEventListener('mousedown', handleDrag);
        }
    }, [allowDrag, layoutRef, scale])

    return [scale, rotateDegree, translate] as const;
}
