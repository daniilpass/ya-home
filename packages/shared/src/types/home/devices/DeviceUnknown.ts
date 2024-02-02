import { DeviceTypes } from '../deviceTypes/index.js';
import { DeviceBase } from './DeviceBase.js';

export type DeviceUnknown = DeviceBase & {
    type: typeof DeviceTypes.Unknown;
    state?: null;
}