import type { YaDeviceCapability } from './YaDeviceCapability';

export type YaDeviceAction = Omit<YaDeviceCapability, 'state_changed_at' | 'parameters'>

export type YaDeviceActions = {
    id: string;
    actions: YaDeviceAction[];
}