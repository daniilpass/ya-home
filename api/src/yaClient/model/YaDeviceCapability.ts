import { YaDeviceCapabilityType } from './YaDeviceCapabilityType.js'
import { YaDeviceCapabilityState } from './YaDeviceCapabilityState.js';

export type YaDeviceCapability = {
    type: YaDeviceCapabilityType;
    state: YaDeviceCapabilityState | null;
};