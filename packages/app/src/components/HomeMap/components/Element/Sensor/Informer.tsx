import { DeviceStateKeys, DeviceStateType } from '@homemap/shared';

import { THIN_SPACE } from '../../../../../constants/symbols';
import { DeviceIcon } from '../../../../DeviceIcon';
import { getDeviceStateIcon, getDeviceUnitTitle, getSensorStateValue } from '../../../../../utils/device';

import './style.scss';

type SensorInformerProps = {
    type: DeviceStateKeys;
    state: DeviceStateType;
}



export const SensorInformer = ({ type, state }: SensorInformerProps) => {
    const sensorValue = getSensorStateValue(type, state)!.toString();
    const sensorUnit = getDeviceUnitTitle(state.unit);
    const sensorIcon = getDeviceStateIcon(type);

    return (
        <div className='informer'>
            {sensorIcon && <DeviceIcon name={sensorIcon} sx={{fill: 'white'}}/>}
            <div className='informer__value'>
                {sensorValue}
                {THIN_SPACE}
                {sensorUnit}
            </div>
        </div>
    )
};
