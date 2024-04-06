import { DeviceStateKeys, DeviceStateType } from '@homemap/shared';

import { THIN_SPACE } from '../../../../../constants/symbols';
import { DeviceIcon } from '../../../../DeviceIcon';
import { getDeviceStateIcon, getDeviceUnitTitle } from '../../../../../utils/device';

import './style.scss';

type SensorInformerProps = {
    state: DeviceStateType<unknown>;
}

const roundSensorValue = (value: number) => Math.round(value * 10) / 10;

export const SensorInformer = ({ state }: SensorInformerProps) => {
    const sensorValue = roundSensorValue(+state.value!).toString();
    const sensorUnit = getDeviceUnitTitle(state.unit);
    const sensorIcon = getDeviceStateIcon(DeviceStateKeys.Temperature);

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
