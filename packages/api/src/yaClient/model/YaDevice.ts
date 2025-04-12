import type { YaDeviceCapability } from './YaDeviceCapability';
import type { YaDeviceProperty } from './YaDeviceProperty';
import type { YaDeviceType } from './YaDeviceType';

export type YaDevice = {
    id: string;
    name: string;
    type: YaDeviceType;
    capabilities: YaDeviceCapability[];
    properties: YaDeviceProperty[];
}