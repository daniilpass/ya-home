import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Point } from '@homemap/shared';

import PointInput from '../PointInput';

import './styles.css';

type PointsListItemProps = {
    index: number;
    value: Point;
    onChange: (index: number, value: Point) => void;
    onDelete: (index: number) => void;
}

export const PointsListItem = ({
    index,
    value,
    onChange,
    onDelete,
}: PointsListItemProps) => {
    return (
        <div className="points-list_item">
            <PointInput value={value} onChange={(value) => onChange(index, value)} />
            <IconButton onClick={() => onDelete(index)}>
                <DeleteIcon />
            </IconButton >
        </div>
    )
}
