import { DeviceStateBrightness, DeviceStateOnOf } from '../deviceStates/index.js';
import { DeviceTypes } from '../deviceTypes/index.js';
import { DeviceBase } from './DeviceBase.js';

export type DeviceLight = DeviceBase & {
    type: typeof DeviceTypes.Light;
    state: Partial<DeviceStateOnOf & DeviceStateBrightness>;
}