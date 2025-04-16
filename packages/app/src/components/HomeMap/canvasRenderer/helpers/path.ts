export function withPath(ctx: CanvasRenderingContext2D, callback: () => void) {
    ctx.beginPath();

    callback();

    ctx.closePath();
}