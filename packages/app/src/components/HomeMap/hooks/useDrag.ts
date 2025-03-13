import {MouseEvent as ReactMouseEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';
import useBodyCursor from './useBodyCursor';

export type DragStartEvent = ReactMouseEvent<Element, MouseEvent> | MouseEvent;

export type DragEvent = MouseEvent & {
    clientXDiff: number;
    clientYDiff: number;
    pageXDiff: number;
    pageYDiff: number;
};

export type onDragCallback = (e: DragEvent, options?: any) => void;

document.addEventListener('pointerup', () => console.log("pointerup"));
export const useDrag = (
    onDrag?: onDragCallback,
    button: MouseButton = MouseButton.LEFT,
    strict?: boolean,
) => {
    const { setCursor, resetCursor } = useBodyCursor();

    const onDragStart = useCallback((dragStartEvent: DragStartEvent, options?: any) => {
        if (dragStartEvent.button !== button || !onDrag) {
            return;
        }

        if (strict && dragStartEvent.target !== dragStartEvent.currentTarget) {
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
            document.removeEventListener('pointermove', handleDrag);
            document.removeEventListener('pointerup', endDrag);
            document.addEventListener('pointercancel', endDrag);
            document.removeEventListener('wheel', endDrag);
        }

        document.addEventListener('pointermove', handleDrag);
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointercancel', endDrag);
        document.addEventListener('wheel', endDrag);
    }, [button, onDrag, resetCursor, setCursor, strict]);

    return onDragStart;
}
