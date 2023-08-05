import {FC} from 'react';

import {Point} from '../../../../services/configurationService/model/Area';

import './styles.css';

type Props = {
    points: Point[]
}

const Shadow: FC<Props> = ({points}) => {
    const svgPoints = points.flat().join(',');
    return (
        <polygon points={svgPoints} className='element-shadow'/>
    )
}

export default Shadow;
