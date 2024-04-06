import {FC, useEffect, useRef} from 'react';

import { DeviceState,  DeviceTypes,  MouseButton, Point } from '@homemap/shared';

import {useTransformContext} from '../../providers/TransformContextProvider';
import {useDrag} from '../../hooks/useDrage';
import {EditActionMove} from '../EditAction';
import { DeviceIconName } from '../../../DeviceIcon';
import LightElement from './Light';
import SensorElement from './Sensor';

type Props = {
    type: DeviceTypes;
    position: Point;
    icon?: DeviceIconName;
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    onClick?: () => void;
    onDrag?: (pageX: number, pageY: number) => void;
}

const Element: FC<Props> = ({type, position, icon, state, substate, isEditMode, onClick, onDrag}) => {
    const { editElementDrag } = useTransformContext();
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

    return (
        <>
            {(type === DeviceTypes.Light || type === DeviceTypes.Switch) && (
                <LightElement
                    position={position}
                    icon={icon as DeviceIconName}
                    state={state}
                    substate={substate}
                    onClick={onClick}
                />
            )}
            {type === DeviceTypes.Sensor && state && (
                <SensorElement
                    position={position}
                    state={state}
                    substate={substate}
                />
            )}
            {isEditMode && (
                <EditActionMove
                    x={position[0]}
                    y={position[1]}
                    onMouseDown={onDragStart}
                    ref={moveRef}
                />
            )}
        </>
        
    )
}

export default Element;
