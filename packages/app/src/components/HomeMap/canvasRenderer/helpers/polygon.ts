import type { Point } from '@homemap/shared';

import { withPath } from './path';
import { lineByPoints } from './line';

export function drawPolygon(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    fillStyle: string | CanvasGradient | CanvasPattern = 'black',
    strokeStyle: string | CanvasGradient | CanvasPattern | undefined = undefined
) {
    withPath(ctx, () => lineByPoints(ctx, points));

    ctx.fillStyle = fillStyle;
    ctx.fill(); 

    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
}

export function clipPolygon(
    ctx: CanvasRenderingContext2D,
    points: Point[],
) {
    ctx.save();

    withPath(ctx, () => {
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        lineByPoints(ctx, points);
    });
    
    ctx.clip('evenodd');

    return () => {
        ctx.restore();
    };
}