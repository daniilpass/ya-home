import { DeviceTypes } from '../deviceTypes';
import { DeviceStateOnOf } from '../deviceStates';
import { DeviceBase } from './DeviceBase';

export type DeviceSwitch = DeviceBase & {
    type: DeviceTypes.Switch;
    state: Partial<DeviceStateOnOf>;
}