import { DeviceStateHumidity, DeviceStateMotion, DeviceStateTemperature } from '../deviceStates';
import { DeviceTypes } from '../deviceTypes';
import { DeviceBase } from './DeviceBase';

export type DeviceSensor = DeviceBase & {
    type: DeviceTypes.Sensor;
    state: Partial<DeviceStateTemperature & DeviceStateHumidity & DeviceStateMotion>;
}