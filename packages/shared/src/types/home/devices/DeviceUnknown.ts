import { DeviceState } from '../deviceStates';
import { DeviceTypes } from '../deviceTypes';
import { DeviceBase } from './DeviceBase';

export type DeviceUnknown = DeviceBase & {
    type: DeviceTypes.Unknown;
    state: DeviceState;
}