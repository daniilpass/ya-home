import {FC, useEffect, useRef} from 'react';
import cx from 'classnames'

import { DeviceState } from '@homemap/shared';

import { MouseButton, Point } from '../../../../common/types';
import {Substate} from '../../../../services/mapService/model/Substate';
import {useTransformContext} from '../../providers/TransformContextProvider';
import {useDrag} from '../../hooks/useDrage';
import {ELEMENT_RADIUS} from '../../constants';
import {EditActionMove} from '../EditAction';
import { DeviceIcon, DeviceIconName } from '../../../DeviceIcon';

import './styles.css';

type Props = {
    position: Point;
    icon?: DeviceIconName;
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    onClick?: () => void;
    onDrag?: (pageX: number, pageY: number) => void;
}

const Element: FC<Props> = ({position, icon, state, substate, isEditMode, onClick, onDrag}) => {
    const {rotate, editElementDrag} = useTransformContext();
    const onDragStart = useDrag(onDrag);
    const moveRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (moveRef?.current && isEditMode && editElementDrag) {
            const bounds = (moveRef.current as Element).getBoundingClientRect();
            onDragStart({
                button: MouseButton.LEFT,
                currentTarget: moveRef.current,
                clientX: bounds.left + bounds.width / 2,
                clientY: bounds.top + bounds.height / 2,
            });
        }
    }, [moveRef, isEditMode, editElementDrag]);

    const elementClassName = cx('element', {
        'element--on': state?.on,
        'element--pending': substate === Substate.Pending,
        'element--synced': substate === Substate.Synced,
        'element--lost': substate === Substate.Lost,
        'element--edit': isEditMode,
    });

    const elementStyle = {
        transform: `rotate(${-rotate}deg)`,
        transformOrigin: `${position[0]}px ${position[1]}px`,
    };

    return (
        <g
            className={elementClassName}
            style={elementStyle}
            onClick={onClick}
        >
            <circle
                className='element-shape'
                cx={position[0]}
                cy={position[1]}
                r={ELEMENT_RADIUS}
            />
            {icon && (
                <svg
                    className='element-icon'
                    x={position[0] - ELEMENT_RADIUS / 2}
                    y={position[1] - ELEMENT_RADIUS / 2}
                    width={ELEMENT_RADIUS} 
                    height={ELEMENT_RADIUS}
                >
                    <DeviceIcon name={icon} />
                </svg>
            )} 
            {isEditMode && (
                <EditActionMove
                    x={position[0]}
                    y={position[1]}
                    onMouseDown={onDragStart}
                    ref={moveRef}
                />
            )}
        </g>
    )
}

export default Element;
