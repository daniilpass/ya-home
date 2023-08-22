import {RefObject, useState, useLayoutEffect} from 'react';

const LOAD_EVENT = 'load';
const RESIZE_EVENT = 'resize';

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

        image?.addEventListener(LOAD_EVENT, handleResize);
        window.addEventListener(RESIZE_EVENT, handleResize);

        return () => {
            image?.removeEventListener(LOAD_EVENT, handleResize);
            window.removeEventListener(RESIZE_EVENT, handleResize);
        }
    }, [imageRef, wrapperRef, allowScale, allowRotate]);

    return [scale, rotateDegree] as const;
}
