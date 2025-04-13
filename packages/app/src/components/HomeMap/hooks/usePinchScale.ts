import type { RefObject } from 'react';
import { useLayoutEffect, useCallback, useRef } from 'react';

import type { DragEvent } from './useDrag';
import { useDrag } from './useDrag';

const MOVE_BOUND = 1;

type PointerInfo = {
    primary: boolean;
    id: number;
    x: number;
    y: number;
}

const pointerEventToInfo = (e: PointerEvent): PointerInfo  => ({
    id: e.pointerId,
    primary: e.isPrimary,
    x: e.x,
    y: e.y,
});

const getDistance = (
    { x: x1, y: y1 }: PointerInfo | PointerEvent,
    { x: x2, y: y2 }: PointerInfo | PointerEvent,
): number => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    
export const usePinchScale = (
    wrapperRef: RefObject<HTMLDivElement | null>,
    onScale: (dircetion: 'up' | 'down', distance: number) => void,
    onScaleStart: () => void,
    disabled?: boolean,
) => {
    const primaryPointer = useRef<PointerInfo | null>(null);
    const secondaryPointer = useRef<PointerInfo | null>(null);

    // Drag
    const onDrag = useCallback((e: DragEvent) => {
        // It takes two touches to zoom
        if (!primaryPointer.current || !secondaryPointer.current) {
            return;
        }

        if (!e.isPrimary && e.pointerId !== secondaryPointer.current.id) {
            return;
        }

        // Get current pointers
        const pointerRef = e.isPrimary ? primaryPointer : secondaryPointer;
        const oppostePointerRef = e.isPrimary ? secondaryPointer : primaryPointer;

        // Calc delta distance
        const prevDistance = getDistance(oppostePointerRef.current!, pointerRef.current!);
        const currentDistance = getDistance(oppostePointerRef.current!, e);
        const deltaDistance = currentDistance - prevDistance;

        // Update current pointer
        pointerRef.current = pointerEventToInfo(e);

        if (Math.abs(deltaDistance) < MOVE_BOUND) {
            return;
        }

        if (deltaDistance >= 0) {
            onScale('up', deltaDistance);
        } else {
            onScale('down', deltaDistance);
        }
    }, [onScale]);

    const onDragEnd = useCallback(() => {
        primaryPointer.current = null;
        secondaryPointer.current = null;
    }, []);

    const onDragStart = useDrag({ onDrag, onDragEnd, multiTouch: true });

    useLayoutEffect(() => {
        if (disabled) {
            return;
        }

        const wrapper = wrapperRef.current;
        if(!wrapper){
            return;
        }

        const handleDragStart = (e: PointerEvent) => {
            const pointerRef = e.isPrimary ? primaryPointer : secondaryPointer;
            pointerRef.current = pointerEventToInfo(e);

            onScaleStart?.();
            onDragStart(e);
        };
        
        wrapper.addEventListener('pointerdown', handleDragStart);

        return () => {
            wrapper.removeEventListener('pointerdown', handleDragStart);
        };
    }, [wrapperRef, onDragStart, onScaleStart, disabled]);
};
