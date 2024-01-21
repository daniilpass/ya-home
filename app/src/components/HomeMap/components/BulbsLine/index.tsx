import {FC} from 'react';
import cx from 'classnames';

import {pointsToPathDirections} from '../../tools';
import {Point} from '../../../../services/configurationService/model/Area';
import {State} from '../../../../services/mapService/model/State';
import { Substate } from '../../../../services/mapService/model/Substate';
import {EditActionMove} from '../EditAction';
import {useDrag} from '../../hooks/useDrage';

import './styles.css';

type Props = {
    points: Point[];
    state?: string;
    substate?: string;
    isEditMode?: boolean;
    onPointDrag?: (index: number, pageX: number, pageY: number) => void;
}

const BulbsLine: FC<Props> = ({points, state, substate, isEditMode, onPointDrag}) => {
    const directions = pointsToPathDirections(points);
    const className = cx('element-bulbs-line', {
        'element-bulbs-line--on': state === State.On,
        'element-bulbs-line--lost': substate === Substate.Lost,
    });

    const onDrag = (pageX: number, pageY: number, options: any) => {
        const {index} = options;
        onPointDrag && onPointDrag(index, pageX, pageY);
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
