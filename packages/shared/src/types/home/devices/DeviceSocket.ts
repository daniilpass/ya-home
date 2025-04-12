import type { DeviceTypes } from '../deviceTypes';
import type { DeviceStateOnOf } from '../deviceStates';
import type { DeviceBase } from './DeviceBase';

export type DeviceSocket = DeviceBase & {
    type: DeviceTypes.Socket;
    state: Partial<DeviceStateOnOf>;
}