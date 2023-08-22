import {RefObject, useState, useLayoutEffect} from 'react';

const LOAD_EVENT = 'load';

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    imageRef: RefObject<HTMLImageElement>,
    configuration?: {
        allowScale?: boolean,
        allowRotate?: boolean,
    }
) => {
    const [scale, setScale] = useState(1.0);
    const [rotateDegree, setRotateDegree] = useState(0);
    const {
        allowScale = true,
        allowRotate = true,
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
            if (!wrapper || !image) {
                return;
            }

            const rotateDegree = wrapper.offsetHeight > wrapper.offsetWidth ? 90 : 0;
            const scale = Math.min(
                wrapper.offsetWidth / (rotateDegree === 0 ? image.naturalWidth : image.naturalHeight),
                wrapper.offsetHeight / (rotateDegree === 0 ? image.naturalHeight : image.naturalWidth),
            );

            allowRotate && setRotateDegree(rotateDegree);
            allowScale && setScale(scale);
        }

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(wrapper);
        image?.addEventListener(LOAD_EVENT, handleResize);

        return () => {
            resizeObserver.unobserve(wrapper)
            image?.removeEventListener(LOAD_EVENT, handleResize);
        }
    }, [imageRef, wrapperRef, allowScale, allowRotate]);

    return [scale, rotateDegree] as const;
}
