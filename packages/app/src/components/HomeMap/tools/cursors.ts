import type { Property } from 'csstype';

export const setCursor = (cursor: Property.Cursor) => {
    document.body.style.cursor = cursor;
};

export const resetCursor = () => {
    document.body.style.cursor = 'auto';
};