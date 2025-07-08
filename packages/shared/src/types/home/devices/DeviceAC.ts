import type { DeviceStateOnOf, DeviceStateTargetTemperature, DeviceStateTemperature } from '../deviceStates';
import type { DeviceTypes } from '../deviceTypes';

import type { DeviceBase } from './DeviceBase';

export type DeviceAC = DeviceBase & {
    type: DeviceTypes.AC;
    state: Partial<DeviceStateOnOf | DeviceStateTemperature | DeviceStateTargetTemperature>;
}