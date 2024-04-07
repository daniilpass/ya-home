import {FC} from 'react';
import cx from 'classnames';

import { DeviceState, Point } from '@homemap/shared';

import {pointsToPathDirections} from '../../tools';
import { Substate } from '../../../../services/mapService/model/Substate';
import {EditActionMove} from '../EditAction';
import {DragEvent, useDrag} from '../../hooks/useDrag';

import './styles.css';

type Props = {
    points: Point[];
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    onPointDrag?: (index: number, event: DragEvent) => void;
}

const BulbsLine: FC<Props> = ({points, state, substate, isEditMode, onPointDrag}) => {
    const directions = pointsToPathDirections(points);
    const className = cx('element-bulbs-line', {
        'element-bulbs-line--on': state?.on?.value,
        'element-bulbs-line--lost': substate === Substate.Lost,
    });

    const onDrag = (event: DragEvent, options: any) => {
        const {index} = options;
        onPointDrag && onPointDrag(index, event);
    }

    const onDragStart = useDrag(onDrag);

    return (
        <>
            <path className={className} d={directions} />
            {isEditMode && points.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    x={x}
                    y={y}
                    onMouseDown={(e) => onDragStart(e, {index})}
                />
            ))}
        </>
    )
}

export default BulbsLine;
