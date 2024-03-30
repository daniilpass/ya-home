import { DeviceTypes } from '../deviceTypes';
import { DeviceBase } from './DeviceBase';

export type DeviceUnknown = DeviceBase & {
    type: typeof DeviceTypes.Unknown;
    state?: null;
}