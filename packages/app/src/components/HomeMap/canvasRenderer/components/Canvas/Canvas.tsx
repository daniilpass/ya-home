import { useEffect, useMemo, useRef } from 'react';

import { Plan } from '@homemap/shared';

import classes from './style.module.css';
import { CanvasRenderer } from '../../CanvasRenderer';

type Props = {
    background: Plan['background'];
    width: Plan['width'];
    height: Plan['height'];
    elements?: Plan['devices'];
}

export const Canvas = ({ background, width, height, elements }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const canvasRenderer = useMemo(() => canvasRef.current ? new CanvasRenderer(canvasRef.current) : null, [canvasRef.current]);

    useEffect(() => {
        canvasRenderer?.draw({
            background,
            width,
            height,
            devices: elements ?? {},
        })
    }, [canvasRenderer, background, width, height, elements]);

    return (
        <canvas ref={canvasRef} className={classes.canvas}/>
    )
}