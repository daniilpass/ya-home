import {FC} from 'react';
import cx from 'classnames';

import { DeviceState, Point } from '@homemap/shared';

import {pointsToPathDirections} from '../../tools';
import { Substate } from '../../../../services/mapService/model/Substate';
import {EditActionMove} from '../EditAction';
import {DragEvent } from '../../hooks/useDrag';

import './styles.css';

type Props = {
    points: Point[];
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    onPointDrag?: (index: number, event: DragEvent) => void;
    onPointDragEnd?: (index: number, event: DragEvent) => void;
}

const BulbsLine: FC<Props> = ({ points, state, substate, isEditMode, onPointDrag, onPointDragEnd }) => {
    const directions = pointsToPathDirections(points);
    const className = cx('element-bulbs-line', {
        'element-bulbs-line--on': state?.on?.value,
        'element-bulbs-line--lost': substate === Substate.Lost,
    });

    return (
        <>
            <path className={className} d={directions} />
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
        </>
    )
}

export default BulbsLine;
