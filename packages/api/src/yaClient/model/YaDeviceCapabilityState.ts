import { YaDeviceCapabilityInstance } from './YaDeviceCapabilityInstance';

type YaDeviceCapabilityStateActionResult = {
    status: 'DONE' | 'ERROR';
}

export type YaDeviceCapabilityState = {
    instance: YaDeviceCapabilityInstance;
    value?: unknown;
    action_result?: YaDeviceCapabilityStateActionResult
}