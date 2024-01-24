import {FC, useCallback} from 'react';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
            {
                value.map((point, index) => (
                    <div className='points-list_item' key={index}>
                        <PointInput value={point} onChange={(value) => onChange?.(index, value)} />
                        {onDelete && (
                            <IconButton onClick={() => onDelete(index)}>
                                <DeleteIcon />
                            </IconButton >
                        )}
                    </div>
                ))
            }
            {onAdd && <Button startIcon={<AddIcon />} onClick={onAddClick}>Добавить</Button>}
        </div>
    )
}

export default PointsList;
