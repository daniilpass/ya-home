import type { YaDevicePropertyInstance } from './YaDevicePropertyInstance';
import type { YaDeviceUnit } from './YaDeviceUnit';

export type YaDevicePropertyParametersFloat = {
    instance: YaDevicePropertyInstance;
    unit: YaDeviceUnit;
};

export type YaDevicePropertyParametersEvent = {
    instance: YaDevicePropertyInstance;
    events: {
        value: string;
    }[];
};