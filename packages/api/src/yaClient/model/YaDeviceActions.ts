import { YaDeviceCapability } from './YaDeviceCapability';

export type YaDeviceAction = Omit<YaDeviceCapability, 'state_changed_at'>

export type YaDeviceActions = {
    id: string;
    actions: YaDeviceAction[];
}