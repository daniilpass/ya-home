import { Plan, PlanBackground } from '@homemap/shared';

type PlanRenderData = Omit<Plan, 'id'>;

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        console.log('HELLO CanvasRenderer.constructor')
        this.ctx = canvas.getContext("2d")!;
    }

    public draw(plan: PlanRenderData) {
        console.log('HELLO CanvasRenderer.Draw')
        this.setDimensions(plan.width, plan.height);
        this.drawBackground(plan.background)
    }

    private setDimensions(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private drawBackground(background: PlanBackground) {
        this.ctx.fillStyle = background.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawShadow() {

    }
}