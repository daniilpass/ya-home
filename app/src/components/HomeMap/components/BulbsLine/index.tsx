import {FC} from 'react';

import {pointsToPathDirections} from '../../tools';
import {Point} from '../../../../services/configurationService/model/Area';

import './styles.css';


type Props = {
    points: Point[]
}

const BulbsLine: FC<Props> = ({points}) => {
    const directions = pointsToPathDirections(points);
    return (
        <path d={directions} className='element-bulbs-line'/>
    )
}

export default BulbsLine;
