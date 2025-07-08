import { Orientation, type Point, type DeviceIconType } from '@homemap/shared';

import { ELEMENT_RADIUS } from '../../../constants';
import SwitchableElement from '../Switchable';

import type { AirConditionerProps } from './types';

export const AirConditionerSwitch = ({ position, icon, state, substate, orientation, onClick }: AirConditionerProps) => {
    const horizontal = orientation === Orientation.Horizontal;
    const switchPosition: Point = horizontal ? [position[0] + ELEMENT_RADIUS, position[1]] : [position[0], position[1] + ELEMENT_RADIUS];

    return (
        <SwitchableElement
            position={switchPosition}
            icon={icon as DeviceIconType}
            state={state}
            substate={substate}
            onClick={onClick}
        />
    );
};