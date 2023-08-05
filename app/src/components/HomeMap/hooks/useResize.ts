import {RefObject, useState, useLayoutEffect} from 'react';

const LOAD_EVENT = 'load';
const RESIZE_EVENT = 'resize';

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    imageRef: RefObject<HTMLImageElement>,
) => {
    const [scale, setScale] = useState(1.0);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const image = imageRef.current;

        const handleResize = () => {
            if (!wrapper || !image) {
                return;
            }
            const scale = Math.min(
                wrapper.offsetWidth / image.naturalWidth,
                wrapper.offsetHeight / image.naturalHeight
            );
            setScale(scale);
        }

        image?.addEventListener(LOAD_EVENT, handleResize);
        window.addEventListener(RESIZE_EVENT, handleResize);

        return () => {
            image?.removeEventListener(LOAD_EVENT, handleResize);
            window.removeEventListener(RESIZE_EVENT, handleResize);
        }
    }, [imageRef, wrapperRef]);

    return scale;
}
