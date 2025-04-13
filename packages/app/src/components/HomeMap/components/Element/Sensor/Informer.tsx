import type { DeviceStateKeys, DeviceStateType } from '@homemap/shared';

import { THIN_SPACE } from '../../../../../constants/symbols';
import { DeviceIcon } from '../../../../DeviceIcon';
import { getSensorStateIcon, getDeviceUnitTitle, getSensorColor, getSensorStateValue } from '../../../../../utils/device';

import './style.css';

type SensorInformerProps = {
    type: DeviceStateKeys;
    state: DeviceStateType;
}



export const SensorInformer = ({ type, state }: SensorInformerProps) => {
    const sensorValue = getSensorStateValue(type, state)!.toString();
    const sensorUnit = getDeviceUnitTitle(state.unit);
    const sensorIcon = getSensorStateIcon(type);
    const sensorColor = getSensorColor(type, state);

    return (
        <div className="informer">
            {sensorIcon && <DeviceIcon name={sensorIcon} sx={{ fill: sensorColor }}/>}
            <div 
                className="informer__value"
                style={{
                    color: sensorColor,
                }}
            >
                {sensorValue}
                {THIN_SPACE}
                {sensorUnit}
            </div>
        </div>
    );
};
