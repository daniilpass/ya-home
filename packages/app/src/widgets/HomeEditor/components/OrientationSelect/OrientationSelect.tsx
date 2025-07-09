import { useCallback } from 'react';

import type { SelectChangeEvent } from '@mui/material';
import { MenuItem, Select } from '@mui/material';

import { Orientation } from '@homemap/shared';

import styles from './OrientationSelect.module.css';

type OrientationSelectProps = {
    value?: Orientation;
    onChange?: (value: Orientation) => void;
}

export const OrientationSelect = ({ value, onChange }: OrientationSelectProps) => {
    const handleChange = useCallback((event: SelectChangeEvent<Orientation>) => {
        onChange?.(event.target.value as Orientation);
    }, [onChange]);

    return (
        <Select
            className={styles.root}
            classes={{
                select: styles.select
            }}
            value={value ?? ''}
            onChange={handleChange}
        >
            <MenuItem value={Orientation.Horizontal}>
                    Горизонтально
            </MenuItem>
            <MenuItem value={Orientation.Vertical}>
                    Вертикально
            </MenuItem>
        </Select>
    );
};