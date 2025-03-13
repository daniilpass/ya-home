import {PointerEvent as ReactPointerEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';
import useBodyCursor from './useBodyCursor';

export type DragStartEvent = ReactPointerEvent<Element> | PointerEvent;

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
        if (!dragStartEvent.isPrimary) {
            return;
        }

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

        const handleDrag = (dragEvent: PointerEvent) => {
            if (!dragEvent.isPrimary) {
                return;
            }

            const extendedEvent = Object.assign(dragEvent,{
                clientXDiff: clientXStart - dragEvent.clientX,
                clientYDiff: clientYStart - dragEvent.clientY,
                pageXDiff: pageXStart - dragEvent.pageX,
                pageYDiff: pageYStart - dragEvent.pageY,
            });

            onDrag(extendedEvent, options);
        }

        const endDrag = (e: PointerEvent | WheelEvent) => {
            if ('isPrimary' in e && !e.isPrimary) {
                return;
            }

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
