import type { Plan, PlanBackground } from '@homemap/shared';

import { clipPolygon, drawPolygon } from './helpers/polygon';
import { COLOR } from './constants';

type PlanRenderData = Omit<Plan, 'id'>;

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        console.log('HELLO CanvasRenderer.constructor');
        this.ctx = canvas.getContext('2d')!;
    }

    public draw(plan: PlanRenderData) {
        console.log('HELLO CanvasRenderer.Draw');
        this.setDimensions(plan.width, plan.height);
        this.drawBackground(plan.background);
        this.drawShadow(plan);
    }

    private setDimensions(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private drawBackground(background: PlanBackground) {
        this.ctx.fillStyle = background.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawShadow(plan: PlanRenderData) {
        let stopClip: (() => void) | undefined;

        Object.entries(plan.devices).map(([, device]) => {
            const shadowPoints = device.area?.shadowPoints;
            if (!shadowPoints) {
                return;
            }

            const shadowMaskPoints = device.area?.shadowMaskPoints;
            
            if (shadowMaskPoints) {
                stopClip = clipPolygon(this.ctx, shadowMaskPoints);
            }
        
            drawPolygon(this.ctx, shadowPoints, COLOR.shadow);

            if (stopClip) {
                stopClip();
                stopClip = undefined;
            }
        });
    }
}