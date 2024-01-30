import { YaDeviceCapability } from './YaDeviceCapability.js';
import { YaDeviceType } from './YaDeviceType.js';

export type YaDevice = {
    id: string;
    name: string;
    type: YaDeviceType;
    capabilities: YaDeviceCapability[];
}