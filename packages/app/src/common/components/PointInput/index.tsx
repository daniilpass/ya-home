import {ChangeEvent, FC} from 'react';
import { TextField } from '@mui/material';

import { Point } from '@homemap/shared';

import './styles.css';

type Props = {
    value: Point;
    onChange?: (value: Point) => void;
    // TODO: pass min, max
}

const PointInput: FC<Props> = ({value: [x, y], onChange}) => {
    const onChangeX = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([Number(event.target.value), y]);
    };

    const onChangeY = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([x, Number(event.target.value)]);
    };

    return (
        <div className='point-input'>
            <TextField
                value={Math.floor(x)}
                onChange={onChangeX}
                label="x"
                type="number"
                size="small"
            />
            <TextField
                value={Math.floor(y)}
                onChange={onChangeY}
                label="y"
                type="number"
                size="small"
            />
        </div>
    )
}

export default PointInput;
