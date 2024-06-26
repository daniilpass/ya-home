import {FC, useEffect, useRef} from 'react';

import { DeviceState,  DeviceTypes,  MouseButton, Point } from '@homemap/shared';

import {useTransformContext} from '../../providers/TransformContextProvider';
import {DragEvent, useDrag} from '../../hooks/useDrag';
import {EditActionMove} from '../EditAction';
import { DeviceIconName } from '../../../DeviceIcon';
import LightElement from './Light';
import SensorElement from './Sensor';
import './style.scss';

type Props = {
    type: DeviceTypes;
    position: Point;
    icon?: DeviceIconName;
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    onClick?: () => void;
    onDrag?: (event: DragEvent) => void;
}

const Element: FC<Props> = ({type, position, icon, state, substate, isEditMode, onClick, onDrag}) => {
    const { editElementDrag } = useTransformContext();
    const onDragStart = useDrag(onDrag);
    const moveRef = useRef<SVGGElement>(null);

    useEffect(() => {
        // Start drag newly added device
        if (moveRef?.current && isEditMode && editElementDrag) {
            const bounds = (moveRef.current as Element).getBoundingClientRect();
            const event = new MouseEvent('mousedown', {
                button: MouseButton.LEFT,
                clientX: bounds.left + bounds.width / 2,
                clientY: bounds.top + bounds.height / 2,
            })
            onDragStart(event);
        }
    }, [moveRef, isEditMode, editElementDrag]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isEditMode) {
            return;   
        }
        onDragStart(e);
    }

    const isShowEditAction = isEditMode && type !== DeviceTypes.Sensor;

    const className = isEditMode ? 'element--movable' : undefined;

    return (
        <g
            onMouseDown={handleMouseDown}
            ref={moveRef}
            className={className}
        >
            {(type === DeviceTypes.Light || type === DeviceTypes.Switch) && (
                <LightElement
                    position={position}
                    icon={icon as DeviceIconName}
                    state={state}
                    substate={substate}
                    onClick={onClick}
                />
            )}
            {type === DeviceTypes.Sensor && (
                <SensorElement
                    position={position}
                    state={state ?? {}}
                    substate={substate}
                />
            )}
            {isShowEditAction && (
                <EditActionMove
                    x={position[0]}
                    y={position[1]}
                />
            )}
        </g>
        
    )
}

export default Element;
