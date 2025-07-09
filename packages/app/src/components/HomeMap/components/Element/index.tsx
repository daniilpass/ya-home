import type { FC } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import cx from 'classnames';

import type { DeviceState, Point, DeviceIconType, Orientation } from '@homemap/shared';
import { DeviceTypes, MouseButton } from '@homemap/shared';

import { useTransformContext } from '../../providers/TransformContextProvider';
import type { DragEvent } from '../../hooks/useDrag';
import { useDrag } from '../../hooks/useDrag';
import { EditActionMove } from '../EditAction';

import SwitchableElement from './Switchable';
import SensorElement from './Sensor';
import { AirConditioner } from './AirConditioner';
import './style.css';

type Props = {
    type: DeviceTypes;
    position: Point;
    orientation?: Orientation;
    icon?: DeviceIconType;
    state?: DeviceState | null;
    substate?: string;
    isEditMode?: boolean;
    selectable?: boolean;
    onClick?: () => void;
    onDrag?: (event: DragEvent) => void;
    onDragEnd?: (event: DragEvent) => void;
}

const getElementComponent = (type: DeviceTypes) => {
    switch (type) {
        case DeviceTypes.AC:
            return AirConditioner;
        case DeviceTypes.Sensor:
            return SensorElement;
        case DeviceTypes.Light:
        case DeviceTypes.Switch:
        case DeviceTypes.Socket:
        default:
            return SwitchableElement;
    }
};

const Element: FC<Props> = ({
    type, position, orientation, icon, state, substate, isEditMode, selectable,
    onClick, onDrag, onDragEnd,
}) => {
    const { editElementDrag } = useTransformContext();
    const onDragStart = useDrag({ onDrag, onDragEnd });
    const moveRef = useRef<SVGGElement>(null);

    useEffect(() => {
        // Start drag newly added device
        if (moveRef?.current && isEditMode && editElementDrag) {
            const bounds = (moveRef.current as Element).getBoundingClientRect();
            const event = new PointerEvent('pointerdown', {
                button: MouseButton.LEFT,
                clientX: bounds.left + bounds.width / 2,
                clientY: bounds.top + bounds.height / 2,
            });
            onDragStart(event);
        }
    }, [moveRef, isEditMode, editElementDrag, onDragStart]);

    const handlePointerDown = useCallback((e: PointerEvent) => {
        if (!isEditMode) {
            return;   
        }

        e.stopPropagation();

        onDragStart(e);
    }, [isEditMode, onDragStart]);

    const isShowEditAction = isEditMode && type !== DeviceTypes.Sensor;

    const rootClassName = cx({
        'element--movable': isEditMode,
        'element--selectable': selectable,
    });

    useEffect(() => {
        const element = moveRef.current;
        element?.addEventListener('pointerdown', handlePointerDown);

        return () => {
            element?.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [handlePointerDown]);

    const Component = getElementComponent(type);

    return (
        <g
            ref={moveRef}
            className={rootClassName}
        >
            <Component
                position={position}
                orientation={orientation}
                icon={icon as DeviceIconType}
                state={state ?? {}}
                substate={substate}
                onClick={onClick}
            />

            {isShowEditAction && (
                <EditActionMove
                    index={0}
                    x={position[0]}
                    y={position[1]}
                    draggable={false}
                />
            )}
        </g>
        
    );
};

export default Element;
