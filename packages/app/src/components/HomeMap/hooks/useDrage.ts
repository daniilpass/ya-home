import {MouseEvent as ReactMouseEvent} from 'react';

import { MouseButton } from '@homemap/shared';

const EVENT_MOUSEMOVE = 'mousemove';
const EVENT_MOUSEUP = 'mouseup';

export type DragStartEvent = ReactMouseEvent<Element, MouseEvent> | MouseEvent;

export type DragEvent = MouseEvent & {
    clientXDiff: number;
    clientYDiff: number;
    pageXDiff: number;
    pageYDiff: number;
};

export type onDragCallback = (e: DragEvent, options?: any) => void;

export const useDrag = (
    onDrag?: onDragCallback,
    button: MouseButton = MouseButton.LEFT,
) => {
    const onDragStart = (dragStartEvent: DragStartEvent, options?: any) => {
        if (dragStartEvent.button !== button || !onDrag) {
            return;
        }

        const clientXStart = dragStartEvent.clientX;
        const clientYStart = dragStartEvent.clientY;
        const pageXStart = dragStartEvent.pageX;
        const pageYStart = dragStartEvent.pageY;

        const handleDrag = (dragEvent: MouseEvent) => {
            const extendedEvent = Object.assign(dragEvent,{
                clientXDiff: clientXStart - dragEvent.clientX,
                clientYDiff: clientYStart - dragEvent.clientY,
                pageXDiff: pageXStart - dragEvent.pageX,
                pageYDiff: pageYStart - dragEvent.pageY,
            })
            onDrag(extendedEvent, options);
        }

        document.addEventListener(EVENT_MOUSEMOVE, handleDrag);
        document.addEventListener(EVENT_MOUSEUP, () => {
            document.removeEventListener(EVENT_MOUSEMOVE, handleDrag)
        });
    }

    return onDragStart;
}
