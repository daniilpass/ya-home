import React, {RefObject, useState, useLayoutEffect} from 'react';

const RESIZE_EVENT = 'resize';

export const useResize = (
    wrapperRef: RefObject<HTMLDivElement>,
    imageRef: RefObject<HTMLImageElement>,
) => {
    const [scale, setScale] = useState(1.0);

    useLayoutEffect(() => {
        handleResize();
        window.addEventListener(RESIZE_EVENT, handleResize);
        return () => {
            window.removeEventListener(RESIZE_EVENT, handleResize);
        }
    }, []);

    const handleResize = () => {
        if (!wrapperRef.current || !imageRef.current) {
            return;
        }
        const scale = Math.min(
            wrapperRef.current.offsetWidth / imageRef.current.naturalWidth,
            wrapperRef.current.offsetHeight / imageRef.current.naturalHeight
        );
        setScale(scale);
    }

    return scale;
}
