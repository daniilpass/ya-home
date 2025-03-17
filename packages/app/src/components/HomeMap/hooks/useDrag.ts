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

export type UseDragParams = {
    button?: MouseButton,
    strict?: boolean,
    multiTouch?: boolean,
    onDrag?: onDragCallback,
    onDragEnd?: onDragCallback,
}

export const useDrag = ({
    button = MouseButton.ANY,
    strict = false,
    multiTouch = false,
    onDrag,
    onDragEnd,
}: UseDragParams) => {
    const onDragStart = useCallback((dragStartEvent: DragStartEvent, options?: any) => {
        let lastEvent: DragEvent | undefined;
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

            const extendedEvent: DragEvent = Object.assign(dragEvent,{
                clientXDiff: clientXStart - dragEvent.clientX,
                clientYDiff: clientYStart - dragEvent.clientY,
                pageXDiff: pageXStart - dragEvent.pageX,
                pageYDiff: pageYStart - dragEvent.pageY,
            });

            lastEvent = extendedEvent;

            onDrag(extendedEvent, options);
        }

        const endDrag = () => {
            if (lastEvent && onDragEnd) {
                onDragEnd(lastEvent, options);
            }

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
                endDrag();
            }
        }

        document.addEventListener('pointerdown', preventMultiTouch);
        document.addEventListener('pointermove', handleDrag);
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointercancel', endDrag);
        document.addEventListener('wheel', endDrag);
    }, [button, onDrag, onDragEnd, strict, multiTouch]);

    return onDragStart;
}
