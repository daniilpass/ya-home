import {MouseEvent as ReactMouseEvent} from 'react';

import { MouseButton } from '../../../common/types';

const EVENT_MOUSEMOVE = 'mousemove';
const EVENT_MOUSEUP = 'mouseup'

export const useDrag = (
    onDrag?: (pageX: number, pageY: number, options?: any) => void,
    button: MouseButton = MouseButton.LEFT,
) => {
    const onDragStart = (e: ReactMouseEvent<Element, MouseEvent>, options?: any) => {
        if (e.button !== button) {
            return;
        }

        const bounds = (e.currentTarget as Element).getBoundingClientRect();
        const x = e.clientX - bounds.left - bounds.width / 2;
        const y = e.clientY - bounds.top - bounds.height / 2;

        const handleDrag = (e: MouseEvent) => {
            onDrag && onDrag(e.pageX - x, e.pageY - y, options);
        }
        document.addEventListener(EVENT_MOUSEMOVE, handleDrag);
        document.addEventListener(EVENT_MOUSEUP, () => {
            document.removeEventListener(EVENT_MOUSEMOVE, handleDrag)
        });
    }

    return onDragStart;
}
