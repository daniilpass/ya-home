import { DeviceTypes } from '../deviceTypes';
import { DeviceStateOnOf } from '../deviceStates';
import { DeviceBase } from './DeviceBase';

export type DeviceSocket = DeviceBase & {
    type: DeviceTypes.Socket;
    state: Partial<DeviceStateOnOf>;
}