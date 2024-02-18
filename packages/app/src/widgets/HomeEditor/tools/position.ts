import { Point, Bounds,  Offset } from '@homemap/shared';

export const limitPosition = ([x, y]: Point, bounds: Partial<Bounds>): Point => {
    const maxX = bounds.right ?? Number.POSITIVE_INFINITY;
    const minX = bounds.left ?? Number.NEGATIVE_INFINITY;
    const maxY = bounds.bottom ?? Number.POSITIVE_INFINITY;
    const minY = bounds.top ?? Number.NEGATIVE_INFINITY;

    return [
        Math.min(maxX, Math.max(minX, x)),
        Math.min(maxY, Math.max(minY, y)),
    ];
}

export const limitPositions = (points: Point[], bounds: Partial<Bounds>): Point[] => points.map(p => limitPosition(p, bounds));

export const toRelativePosition = (position: Point, offset: Offset, scale: number): Point => {
    return [
        (position[0] - offset.left) / scale,
        (position[1] - offset.top) / scale,
    ]
}