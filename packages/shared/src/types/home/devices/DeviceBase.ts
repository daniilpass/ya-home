import type { DeviceSubtypes } from '../deviceTypes';

export type DeviceBase = {
    id: string;
    name: string;
    subtype: DeviceSubtypes;
}