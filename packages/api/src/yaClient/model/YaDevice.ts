import { YaDeviceCapability } from './YaDeviceCapability';
import { YaDeviceProperty } from './YaDeviceProperty';
import { YaDeviceType } from './YaDeviceType';

export type YaDevice = {
    id: string;
    name: string;
    type: YaDeviceType;
    capabilities: YaDeviceCapability[];
    properties: YaDeviceProperty[];
}