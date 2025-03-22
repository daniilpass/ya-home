import {PointerEvent as ReactPointerEvent, useCallback} from 'react';

import { MouseButton } from '@homemap/shared';
import { setCursor, resetCursor } from '../tools/cursors';

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

const dragFreq = 1000 / 60;
const minDragDistancePx = 4;

export const useDrag = ({
    button = MouseButton.ANY,
    strict = false,
    multiTouch = false,
    onDrag,
    onDragEnd,
}: UseDragParams) => {
    const onDragStart = useCallback((dragStartEvent: DragStartEvent, options?: any) => {
        let lastDragEvent: DragEvent | undefined;
        let lastDragEventTime = Date.now();
        let dragFreeze = true;

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

        const checkThrottle = () => {
            const now = Date.now();

            if (now - lastDragEventTime < dragFreq) {
                return true;
            } else {
                lastDragEventTime = now;
            }

            return false
        }

        const checkMultiTouch = (dragEvent: PointerEvent) => {
            if (!dragEvent.isPrimary && !multiTouch) {
                return true;
            }

            return false;
        }


        const checkFreezeZone = (dragEvent: PointerEvent) => {
            if (!dragFreeze) {
                return false;
            }

            const diffX = clientXStart - dragEvent.clientX;
            const diffY = clientYStart - dragEvent.clientY;
            const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

            if (distance < minDragDistancePx) {
                return true;
            }

            dragFreeze = false;
            return false;
        }

        const handleDrag = (dragEvent: PointerEvent) => {
            if (checkThrottle() || checkMultiTouch(dragEvent) || checkFreezeZone(dragEvent)) {
                return;
            }

            const extendedEvent: DragEvent = Object.assign(dragEvent,{
                clientXDiff: clientXStart - dragEvent.clientX,
                clientYDiff: clientYStart - dragEvent.clientY,
                pageXDiff: pageXStart - dragEvent.pageX,
                pageYDiff: pageYStart - dragEvent.pageY,
            });

            lastDragEvent = extendedEvent;

            onDrag(extendedEvent, options);
        }

        const endDrag = () => {
            if (lastDragEvent && onDragEnd) {
                onDragEnd(lastDragEvent, options);
            }

            resetCursor();

            window.requestAnimationFrame(() => {
                document.removeEventListener('click', preventOtherPoinerEvents, true);
            });
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

        const preventOtherPoinerEvents = (e: Event) => {
            // If no drag - allow event
            if (!lastDragEvent) {
                return;
            }

            e.stopPropagation();
        }

        document.addEventListener('click', preventOtherPoinerEvents, true);
        document.addEventListener('pointerdown', preventMultiTouch);
        document.addEventListener('pointermove', handleDrag);
        document.addEventListener('pointerup', endDrag);
        document.addEventListener('pointercancel', endDrag);
        document.addEventListener('wheel', endDrag);
    }, [button, onDrag, onDragEnd, strict, multiTouch]);

    return onDragStart;
}
