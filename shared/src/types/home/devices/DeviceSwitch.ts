import { DeviceTypes } from '../deviceTypes/index.js';
import { DeviceStateOnOf } from '../deviceStates/index.js';
import { DeviceBase } from './DeviceBase.js';

export type DeviceSwitch = DeviceBase & {
    type: DeviceTypes.Switch;
    state: Partial<DeviceStateOnOf>
}