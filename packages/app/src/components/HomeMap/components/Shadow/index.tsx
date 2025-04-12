import { FC } from 'react';

import { DeviceState, Point } from '@homemap/shared';

import { DragEvent } from '../../hooks/useDrag';
import { EditActionMove } from '../EditAction';

import './styles.css';

type Props = {
    id: string;
    points: Point[];
    maskPoints?: Point[];
    state?: DeviceState | null;
    isEditMode?: boolean;
    onPointDrag?: (index: number, event: DragEvent) => void;
    onPointDragEnd?: (index: number, event: DragEvent) => void;
    onMaskPointDrag?: (index: number, event: DragEvent) => void;
    onMaskPointDragEnd?: (index: number, event: DragEvent) => void;
}

const Shadow: FC<Props> = ({
    id, points, maskPoints, state, isEditMode,
    onPointDrag, onPointDragEnd, onMaskPointDrag, onMaskPointDragEnd
}) => {
    if (state?.on?.value) {
        return null;
    }

    const svgShadowPoints = points.flat().join(',');
    const svgMaskPoints = maskPoints?.flat().join(',');
    const maskId = `shadow-mask-${id}`;
    const mask =  svgMaskPoints && `url(#${maskId})`;

    return (
        <>
            <polygon className="element-shadow" points={svgShadowPoints} mask={mask} />
            {svgMaskPoints && (
                <mask id={maskId}>
                    <polygon points={svgShadowPoints} fill="white" />
                    <polygon points={svgMaskPoints} fill="black" />
                </mask>
            )}
            {isEditMode && points.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    index={index}
                    x={x}
                    y={y}
                    onDrag={onPointDrag}
                    onDragEnd={onPointDragEnd}
                />
            ))}
            {isEditMode && maskPoints && maskPoints.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    index={index}
                    x={x}
                    y={y}
                    onDrag={onMaskPointDrag}
                    onDragEnd={onMaskPointDragEnd}
                />
            ))}
        </>
    )
}

export default Shadow;
