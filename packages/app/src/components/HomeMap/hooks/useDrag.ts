import {MouseEvent as ReactMouseEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';
import useBodyCursor from './useBodyCursor';

const EVENT_MOUSEMOVE = 'mousemove';
const EVENT_MOUSEUP = 'mouseup';
const EVENT_WHEEL = 'wheel';

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
    const { setCursor, resetCursor } = useBodyCursor();

    const onDragStart = useCallback((dragStartEvent: DragStartEvent, options?: any) => {
        if (dragStartEvent.button !== button || !onDrag) {
            return;
        }

        setCursor('move');

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
            });
            onDrag(extendedEvent, options);
        }

        const endDrag = () => {
            resetCursor();
            document.removeEventListener(EVENT_MOUSEMOVE, handleDrag);
        }
    
        document.addEventListener(EVENT_MOUSEMOVE, handleDrag);
        document.addEventListener(EVENT_MOUSEUP, endDrag);
        document.addEventListener(EVENT_WHEEL, endDrag);
    }, [button, onDrag, resetCursor, setCursor])

    return onDragStart;
}
