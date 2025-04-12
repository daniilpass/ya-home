import type { DeviceTypes } from '../deviceTypes';
import type { DeviceStateOnOf } from '../deviceStates';

import type { DeviceBase } from './DeviceBase';

export type DeviceSwitch = DeviceBase & {
    type: DeviceTypes.Switch;
    state: Partial<DeviceStateOnOf>;
}