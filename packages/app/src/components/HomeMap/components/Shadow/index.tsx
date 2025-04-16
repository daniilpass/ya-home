import type { FC } from 'react';

import type { DeviceState, Point } from '@homemap/shared';

import type { DragEvent } from '../../hooks/useDrag';
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
    points, maskPoints, state, isEditMode,
    onPointDrag, onPointDragEnd, onMaskPointDrag, onMaskPointDragEnd
}) => {
    if (state?.on?.value) {
        return null;
    }

    return (
        <>
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
    );
};

export default Shadow;
