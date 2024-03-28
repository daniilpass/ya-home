import {ChangeEvent, FC} from 'react';
import { Box, SxProps, TextField, Theme } from '@mui/material';

import { Point } from '@homemap/shared';

type Props = {
    value: Point;
    onChange?: (value: Point) => void;
    labelX?: string;
    labelY?: string;
    vertical?: boolean;
}

const PointInput: FC<Props> = ({value: [x, y], labelX, labelY, vertical, onChange}) => {
    const onChangeX = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([Number(event.target.value), y]);
    };

    const onChangeY = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([x, Number(event.target.value)]);
    };

    const style: SxProps<Theme> = {
        display: 'flex',
        gap: vertical ? 1 : 0.5,
        flexDirection: vertical ? 'column' : 'row',
    }

    return (
        <Box className='point-input' sx={style}>
            <TextField
                value={Math.floor(x).toString()}
                onChange={onChangeX}
                label={labelX ?? "x"}
                type="number"
                size="small"
            />
            <TextField
                value={Math.floor(y).toString()}
                onChange={onChangeY}
                label={labelY ?? "y"}
                type="number"
                size="small"
            />
        </Box>
    )
}

export default PointInput;
