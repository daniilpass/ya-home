import {FC, MouseEventHandler} from 'react';
import { EDIT_ACTION_SIZE } from '../../../constants';

import './styles.css';

type Props = {
    x: number,
    y: number,
    onMouseDown?: MouseEventHandler<Element>,
}

const EditActionMove: FC<Props> = ({
    x,
    y,
    onMouseDown,
}) => {
    return (
        <g className='edit-action__move' onMouseDown={onMouseDown}>
            <svg
                width={EDIT_ACTION_SIZE}
                height={EDIT_ACTION_SIZE}
                x={x - EDIT_ACTION_SIZE / 2}
                y={y - EDIT_ACTION_SIZE / 2}
                fill="none"
                viewBox="0 0 24 24"
            >
                <path fill="#FF0000" fillRule="evenodd" d="M12 2.893 8.818 6.075l1.06 1.061 1.372-1.371v5.485H5.765l1.371-1.371-1.06-1.061L2.894 12l3.182 3.182 1.06-1.06-1.371-1.372h5.485v5.485L9.88 16.864l-1.06 1.06L12 21.107l3.182-3.183-1.06-1.06-1.372 1.371V12.75h5.485l-1.371 1.371 1.06 1.06L21.108 12l-3.182-3.182-1.061 1.06 1.371 1.372H12.75V5.765l1.371 1.371 1.061-1.06L12 2.892Z" clipRule="evenodd"/>
            </svg>
        </g>
    )
}

export default EditActionMove;