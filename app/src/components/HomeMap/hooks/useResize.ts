import {RefObject, useState, useLayoutEffect, MouseEvent as ReactMouseEvent} from 'react';
import {useDrag} from './useDrage';
import { MouseButton } from '../../../common/types';

const LOAD_EVENT = 'load';
const WHEEL_EVENT = 'wheel';
const MIN_SCALE = 0.125;
const MAX_SCALE = 4;
const SCALE_STEP = 0.001;

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    imageRef: RefObject<HTMLImageElement>,
    layoutRef: RefObject<HTMLDivElement>,
    configuration?: {
        allowScale?: boolean,
        allowInitialScale?: boolean,
        allowRotate?: boolean,
        allowInitialRotate?: boolean,
        allowZoom?: boolean;
        allowMove?: boolean;
        allowDrag?: boolean;
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
    } = configuration || {};

    const handleResize = (allowScale: boolean, allowRotate: boolean, wrapper: HTMLElement, image: HTMLImageElement) => {   
        const rotateDegree = allowRotate && wrapper.offsetHeight > wrapper.offsetWidth ? 90 : 0;
        const scale = Math.min(
            wrapper.offsetWidth / (rotateDegree === 0 ? image.naturalWidth : image.naturalHeight),
            wrapper.offsetHeight / (rotateDegree === 0 ? image.naturalHeight : image.naturalWidth),
        );

        if (allowRotate) {
            setRotateDegree(rotateDegree);
        };

        if (allowScale) {
            setScale(scale);
            !allowZoom && setMinScale(scale);
        }
    }

    // Scale'n'Rotate initial
    useLayoutEffect(() => {
        const hookDisabled = !allowInitialScale && !allowInitialRotate;
        const wrapper = wrapperRef.current;
        const image = imageRef.current;

        if (hookDisabled || !wrapper || !image) {
            return;
        }

        const onResize = () => handleResize(allowInitialScale, allowInitialRotate, wrapper, image);
        image?.addEventListener(LOAD_EVENT, onResize);

        return () => {
            image?.removeEventListener(LOAD_EVENT, onResize);
        }
    }, [allowInitialScale, allowInitialRotate, imageRef, wrapperRef]);

    // Scale'n'Rotate observer
    useLayoutEffect(() => {
        const hookDisabled = !allowScale && !allowRotate;
        const wrapper = wrapperRef.current;
        const image = imageRef.current;

        if (hookDisabled || !wrapper || !image) {
            return;
        }

        const onResize = () => handleResize(allowScale, allowRotate, wrapper, image);
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(wrapper);

        return () => {
            resizeObserver.unobserve(wrapper)
        }
    }, [allowScale, allowRotate, imageRef, wrapperRef]);

    // Zoom
    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if(!allowZoom || !wrapper){
            return;
        }

        const handleZoom = (e: any) => {
            let newScale = scale + e.deltaY * -SCALE_STEP;
            newScale = Math.min(Math.max(minScale, newScale), MAX_SCALE);
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
    }, [layoutRef, scale])

    return [scale, rotateDegree, translate] as const;
}
