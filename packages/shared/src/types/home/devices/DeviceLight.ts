import type { DeviceStateBrightness, DeviceStateOnOf } from '../deviceStates';
import type { DeviceTypes } from '../deviceTypes';
import type { DeviceBase } from './DeviceBase';

export type DeviceLight = DeviceBase & {
    type: DeviceTypes.Light;
    state: Partial<DeviceStateOnOf & DeviceStateBrightness>;
}