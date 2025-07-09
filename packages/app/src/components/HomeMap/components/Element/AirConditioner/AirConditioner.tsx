import { type DeviceIconType } from '@homemap/shared';

import type { AirConditionerProps } from './types';
import { AirConditionerBackground } from './AirConditionerBackground';
import { AirConditionerSwitch } from './AirConditionerSwitch';
import { AirConditionerInfo } from './AirConditionerInfo';

export const AirConditioner = ({ position, icon, state, substate, orientation, onClick, onSelect }: AirConditionerProps) => {
    return (
        <g onClick={onSelect}>
            <AirConditionerBackground position={position} orientation={orientation}/>

            <AirConditionerSwitch
                position={position}
                icon={icon as DeviceIconType}
                state={state}
                substate={substate}
                orientation={orientation}
                onClick={onClick}
            />

            <AirConditionerInfo state={state} position={position} orientation={orientation}/>
        </g>
    );
};

