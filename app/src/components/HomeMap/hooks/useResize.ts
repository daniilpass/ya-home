import {RefObject, useState, useLayoutEffect} from 'react';

const LOAD_EVENT = 'load';
const WHEEL_EVENT = 'wheel';

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    imageRef: RefObject<HTMLImageElement>,
    configuration?: {
        allowScale?: boolean,
        allowRotate?: boolean,
        allowZoom?: boolean;
    }
) => {
    const [scale, setScale] = useState(1.0);
    const [minScale, setMinScale] = useState(0.125);
    const [rotateDegree, setRotateDegree] = useState(0);
    const {
        allowScale = true,
        allowRotate = true,
        allowZoom = false,
    } = configuration || {};

    useLayoutEffect(() => {
        if (!allowScale && !allowRotate) {
            return;
        }

        const wrapper = wrapperRef.current;
        const image = imageRef.current;

        if (!wrapper || !image) {
            return;
        }

        const handleResize = () => {
            const rotateDegree = wrapper.offsetHeight > wrapper.offsetWidth ? 90 : 0;
            const scale = Math.min(
                wrapper.offsetWidth / (rotateDegree === 0 ? image.naturalWidth : image.naturalHeight),
                wrapper.offsetHeight / (rotateDegree === 0 ? image.naturalHeight : image.naturalWidth),
            );

            allowRotate && setRotateDegree(rotateDegree);
            if (allowScale) {
                setScale(scale);
                setMinScale(scale);
            }
        }

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(wrapper);
        image?.addEventListener(LOAD_EVENT, handleResize);

        return () => {
            resizeObserver.unobserve(wrapper)
            image?.removeEventListener(LOAD_EVENT, handleResize);
        }
    }, [imageRef, wrapperRef, allowScale, allowRotate]);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        if(!allowZoom || !wrapper){
            return;
        }

        const handleZoom = (e: any) => {
            let newScale = scale + e.deltaY * -0.002;
            newScale = Math.min(Math.max(minScale, newScale), 4);
            setScale(newScale);
        }
        
        wrapper.addEventListener(WHEEL_EVENT, handleZoom);

        return () => {
            wrapper.removeEventListener(WHEEL_EVENT, handleZoom);
        }
    }, [wrapperRef, scale, minScale, allowZoom]);

    return [scale, rotateDegree] as const;
}
