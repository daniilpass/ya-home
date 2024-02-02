import { YaDeviceCapability } from './YaDeviceCapability';
import { YaDeviceType } from './YaDeviceType';

export type YaDevice = {
    id: string;
    name: string;
    type: YaDeviceType;
    capabilities: YaDeviceCapability[];
}