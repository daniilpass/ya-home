import {FC} from 'react';

import PointInput from '../PointInput';
import {Point} from '../../types';

import './styles.css';

type Props = {
    value: Point[];
    onChange?: (index: number, value: Point) => void;
}


const PointsList: FC<Props> = ({value, onChange}) => {
    return (
        <div className='points-list'>
            {
                value.map((point, index) => (
                    <PointInput value={point} onChange={(value) => onChange?.(index, value)} />
                ))
            }
        </div>
    )
}

export default PointsList;
