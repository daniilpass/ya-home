import type { DeviceState } from '../deviceStates';
import type { DeviceTypes } from '../deviceTypes';

import type { DeviceBase } from './DeviceBase';

export type DeviceUnknown = DeviceBase & {
    type: DeviceTypes.Unknown;
    state: DeviceState;
}