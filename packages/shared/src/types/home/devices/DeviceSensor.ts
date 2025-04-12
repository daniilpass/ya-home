import type { DeviceStateHumidity, DeviceStateMotion, DeviceStateTemperature } from '../deviceStates';
import type { DeviceTypes } from '../deviceTypes';
import type { DeviceBase } from './DeviceBase';

export type DeviceSensor = DeviceBase & {
    type: DeviceTypes.Sensor;
    state: Partial<DeviceStateTemperature & DeviceStateHumidity & DeviceStateMotion>;
}