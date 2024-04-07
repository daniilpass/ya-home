import { Property } from 'csstype';

const useBodyCursor = () => {
    const setCursor = (cursor: Property.Cursor) => {
        document.body.style.cursor = cursor;
    };

    const resetCursor = () => {
        document.body.style.cursor = 'auto';
    };

    return { setCursor, resetCursor };
};

export default useBodyCursor;