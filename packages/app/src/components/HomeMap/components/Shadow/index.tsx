import {FC} from 'react';

import { DeviceState, Point } from '@homemap/shared';

import {DragEvent, useDrag} from '../../hooks/useDrage';
import {EditActionMove} from '../EditAction';

import './styles.css';

type Props = {
    id: string;
    points: Point[];
    maskPoints?: Point[];
    state?: DeviceState | null;
    isEditMode?: boolean;
    onPointDrag?: (index: number, event: DragEvent) => void;
    onMaskPointDrag?: (index: number, event: DragEvent) => void;
}

const Shadow: FC<Props> = ({id, points, maskPoints, state, isEditMode, onPointDrag, onMaskPointDrag}) => {
    const onDrag = (event: DragEvent, options: any) => {
        const {index} = options;
        onPointDrag && onPointDrag(index, event);
    }
    const onMaskDrag = (event: DragEvent, options: any) => {
        const {index} = options;
        onMaskPointDrag && onMaskPointDrag(index, event);
    }

    const onDragStart = useDrag(onDrag);
    const onMaskDragStart = useDrag(onMaskDrag);

    if (state?.on?.value) {
        return null;
    }

    const svgShadowPoints = points.flat().join(',');
    const svgMaskPoints = maskPoints?.flat().join(',');
    const maskId = `shadow-mask-${id}`;
    const mask =  svgMaskPoints && `url(#${maskId})`;

    return (
        <>
            <polygon className='element-shadow' points={svgShadowPoints} mask={mask} />
            {svgMaskPoints && (
                <mask id={maskId}>
                    <polygon points={svgShadowPoints} fill='white' />
                    <polygon points={svgMaskPoints} fill='black' />
                </mask>
            )}
            {isEditMode && points.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    x={x}
                    y={y}
                    onMouseDown={(e) => onDragStart(e, {index})}
                />
            ))}
            {isEditMode && maskPoints && maskPoints.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    x={x}
                    y={y}
                    onMouseDown={(e) => onMaskDragStart(e, {index})}
                />
            ))}
        </>
    )
}

export default Shadow;
