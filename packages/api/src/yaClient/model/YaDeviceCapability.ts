import { YaDeviceCapabilityType } from './YaDeviceCapabilityType'
import { YaDeviceCapabilityState } from './YaDeviceCapabilityState';

export type YaDeviceCapability = {
    type: YaDeviceCapabilityType;
    state: YaDeviceCapabilityState | null;
};