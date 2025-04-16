import type { Point } from '@homemap/shared';

export function lineByPoints(
    ctx: CanvasRenderingContext2D,
    points: Point[],
) {
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
}