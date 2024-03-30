import { DeviceStateBrightness, DeviceStateOnOf } from '../deviceStates';
import { DeviceTypes } from '../deviceTypes';
import { DeviceBase } from './DeviceBase';

export type DeviceLight = DeviceBase & {
    type: typeof DeviceTypes.Light;
    state: Partial<DeviceStateOnOf & DeviceStateBrightness>;
}