import {PointerEvent as ReactPointerEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';
import { setCursor, resetCursor } from '../tools/cursors';

const dragFreq = 1000 / 60;

export type DragStartEvent = ReactPointerEvent<Element> | PointerEvent;

export type DragEvent = PointerEvent & {
    clientXDiff: number;
    clientYDiff: number;
    pageXDiff: number;
    pageYDiff: number;
};

export type onDragCallback = (e: DragEvent, options?: any) => void;

export const useDrag = (
    onDrag?: onDragCallback,
    button: MouseButton = MouseButton.LEFT,
    strict?: boolean,
    multiTouch?: boolean,
    endDragCallback?: (e: PointerEvent | WheelEvent) => void,
) => {
    const onDragStart = useCallback((dragStartEvent: DragStartEvent, options?: any) => {
        let lastEventTime = Date.now();

        if (!dragStartEvent.isPrimary && !multiTouch) {
            return;
        }

        const allowedButton = button === dragStartEvent.button || button === MouseButton.ANY;

        if (!allowedButton || !onDrag) {
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
            const now = Date.now();
            if (now - lastEventTime < dragFreq) {
                return;
            } else {
                lastEventTime = now;
            }

            if (!dragEvent.isPrimary && !multiTouch) {
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
            endDragCallback?.(e);

            resetCursor();

            document.removeEventListener('pointerdown', preventMultiTouch);
            document.removeEventListener('pointermove', handleDrag);
            document.removeEventListener('pointerup', endDrag);
            document.removeEventListener('pointercancel', endDrag);
            document.removeEventListener('wheel', endDrag);
            
        }

        const preventMultiTouch = (e: PointerEvent ) => {
            if (multiTouch) {
                return;
            }

            if (!e.isPrimary) {
                endDrag(e);
            }
        }

        document.addEventListener('pointerdown', preventMultiTouch);
        document.addEventListener('pointermove', handleDrag);
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointercancel', endDrag);
        document.addEventListener('wheel', endDrag);
    }, [button, onDrag, endDragCallback, strict, multiTouch]);

    return onDragStart;
}
