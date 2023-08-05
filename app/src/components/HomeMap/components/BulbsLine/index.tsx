import {FC} from 'react';
import cx from 'classnames';

import {pointsToPathDirections} from '../../tools';
import {Point} from '../../../../services/configurationService/model/Area';
import {State} from '../../../../services/mapService/model/State';

import './styles.css';

type Props = {
    points: Point[];
    state?: string;
}

const BulbsLine: FC<Props> = ({points, state}) => {
    const directions = pointsToPathDirections(points);
    const className = cx('element-bulbs-line', {
        'element-bulbs-line--on': state === State.On,
    })
    return (
        <path className={className} d={directions} />
    )
}

export default BulbsLine;
