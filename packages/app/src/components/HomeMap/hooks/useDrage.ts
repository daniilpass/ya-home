import {MouseEvent as ReactMouseEvent} from 'react';

import { MouseButton } from '@homemap/shared';

const EVENT_MOUSEMOVE = 'mousemove';
const EVENT_MOUSEUP = 'mouseup'

type DragEvent = Pick<ReactMouseEvent<Element, MouseEvent>, 'button' | 'currentTarget' | 'clientX' | 'clientY'>

export const useDrag = (
    onDrag?: (pageX: number, pageY: number, options?: any) => void,
    button: MouseButton = MouseButton.LEFT,
) => {
    const onDragStart = (e: DragEvent, options?: any) => {
        if (e.button !== button) {
            return;
        }

        // Element bounds
        const bounds = (e.currentTarget as Element).getBoundingClientRect();

        // Delta between mouse and element center
        const deltaX = e.clientX - bounds.left - bounds.width / 2;
        const deltaY = e.clientY - bounds.top - bounds.height / 2;

        const handleDrag = (e: MouseEvent) => {
            onDrag && onDrag(e.pageX - deltaX, e.pageY - deltaY, options);
        }

        document.addEventListener(EVENT_MOUSEMOVE, handleDrag);
        document.addEventListener(EVENT_MOUSEUP, () => {
            document.removeEventListener(EVENT_MOUSEMOVE, handleDrag)
        });
    }

    return onDragStart;
}
