import {ChangeEvent, FC} from 'react';

import { Point } from '../../types';

import './styles.css';

type Props = {
    value: Point;
    onChange?: (value: Point) => void;
    // TODO: pass min, max
}

const STEP = 1;

const PointInput: FC<Props> = ({value: [x, y], onChange}) => {
    const onChangeX = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([Number(event.target.value), y]);
    };

    const onChangeY = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.([x, Number(event.target.value)]);
    };

    return (
        <div className='point-input'>
            <input
                value={Math.floor(x)}
                onChange={onChangeX}
                type='number'
                step={STEP}
            />
            <input
                value={Math.floor(y)}
                onChange={onChangeY}
                type='number'
                step={STEP}
            />
        </div>
    )
}

export default PointInput;
