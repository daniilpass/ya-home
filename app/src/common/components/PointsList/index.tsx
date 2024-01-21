import {FC, useCallback} from 'react';

import PointInput from '../PointInput';
import {Point} from '../../types';

import './styles.css';

type Props = {
    value: Point[];
    onChange?: (index: number, value: Point) => void;
    onAdd?: (value: Point) => void;
    onDelete?: (index: number) => void;
}


const PointsList: FC<Props> = ({value, onChange, onAdd, onDelete}) => {
    const onAddClick = useCallback(
        () => onAdd?.(value.length > 0 ? value[value.length - 1] : [0, 0]),
        [onAdd, value],
    );

    return (
        <div className='points-list'>
            {value.length === 0 && (
                <div>-</div>
            )}
            {
                value.map((point, index) => (
                    <div className='points-list_item'>
                        <PointInput value={point} onChange={(value) => onChange?.(index, value)} />
                        {onDelete && <button onClick={() => onDelete(index)}>X</button>}
                    </div>
                ))
            }
            {onAdd && <button onClick={onAddClick}>Добавить</button>}
        </div>
    )
}

export default PointsList;
