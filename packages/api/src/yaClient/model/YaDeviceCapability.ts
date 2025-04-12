import type { YaDeviceCapabilityType } from './YaDeviceCapabilityType'
import type { YaDeviceCapabilityState } from './YaDeviceCapabilityState';

export type YaDeviceCapability = {
    type: YaDeviceCapabilityType;
    state: YaDeviceCapabilityState | null;
    state_changed_at: number;
};