import {FC} from 'react';

import {Point} from '../../../../services/configurationService/model/Area';
import {State} from '../../../../services/mapService/model/State';

import './styles.css';

type Props = {
    points: Point[];
    state?: string;
}

const Shadow: FC<Props> = ({points, state}) => {
    if (state === State.On) {
        return null;
    }

    const svgPoints = points.flat().join(',');
    return (
        <polygon points={svgPoints} className='element-shadow'/>
    )
}

export default Shadow;
