import type {FC} from 'react';
import { useCallback, useMemo} from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import type { Point } from '@homemap/shared';

import { PointsListItem } from './PointsListItem';
import './styles.css';

type Props = {
    value: Point[];
    onChange: (index: number, value: Point) => void;
    onAdd: (value: Point) => void;
    onDelete: (index: number) => void;
}

export const PointsList: FC<Props> = ({value, onChange, onAdd, onDelete}) => {
    const onAddClick = useCallback(
        () => onAdd?.(value.length > 0 ? value[value.length - 1] : [0, 0]),
        [onAdd, value],
    );

    const valueInputs = useMemo(() => {
        return value.map((point, index) => (
            <PointsListItem
                key={`${index}${point[0]}${point[1]}`}
                index={index}
                value={point}
                onChange={onChange}
                onDelete={onDelete}
            />
        ));
    }, [value, onChange, onDelete]);

    return (
        <div className="points-list">
            {valueInputs}
            <Button startIcon={<AddIcon />} onClick={onAddClick}>Добавить</Button>
        </div>
    );
};
