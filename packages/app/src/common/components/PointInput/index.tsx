import type { ChangeEvent, FC} from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, TextField } from '@mui/material';

import type { Point } from '@homemap/shared';

type Props = {
    value: Point;
    onChange?: (value: Point) => void;
    labelX?: string;
    labelY?: string;
    vertical?: boolean;
    min?: number;
    max?: number;
}

const PointInput: FC<Props> = ({value: [x, y], labelX, labelY, vertical, min, max, onChange}) => {
    const handleChange = (value: Point) => {
        if (!onChange) {
            return;
        }

        if (max !== undefined && (value[0] > max || value[1] > max)) {
            return;
        }

        if (min !== undefined && (value[0] < min || value[1] < min)) {
            return;
        }

        onChange(value);
    };

    const handleChangeX = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (max !== undefined && value > max) {
            return;
        }
        if (min !== undefined && value < min) {
            return;
        }
    
        handleChange?.([Number(event.target.value), y]);
    };

    const handleChangeY = (event: ChangeEvent<HTMLInputElement>) => {
        handleChange?.([x, Number(event.target.value)]);
    };

    const style: SxProps<Theme> = {
        display: 'flex',
        gap: vertical ? 1 : 0.5,
        flexDirection: vertical ? 'column' : 'row',
    };

    const inputProps = { inputProps: { min, max } };
    return (
        <Box className="point-input" sx={style}>
            <TextField
                value={Math.floor(x).toString()}
                onChange={handleChangeX}
                label={labelX ?? 'x'}
                type="number"
                size="small"
                InputProps={inputProps}
            />
            <TextField
                value={Math.floor(y).toString()}
                onChange={handleChangeY}
                label={labelY ?? 'y'}
                type="number"
                size="small"
                InputProps={inputProps}
            />
        </Box>
    );
};

export default PointInput;
