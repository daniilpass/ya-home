import { YaDeviceCapabilityStateInstance } from './YaDeviceCapabilityStateInstance';

type YaDeviceCapabilityStateActionResult = {
    status: 'DONE' | 'ERROR';
}

export type YaDeviceCapabilityState = {
    instance: YaDeviceCapabilityStateInstance;
    value?: unknown;
    action_result?: YaDeviceCapabilityStateActionResult
}