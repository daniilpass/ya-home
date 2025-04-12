import type { YaDevicePropertyParametersEvent, YaDevicePropertyParametersFloat } from './YaDevicePropertyParameters';
import type { YaDevicePropertyState } from './YaDevicePropertyState';
import type { YaDevicePropertyType } from './YaDevicePropertyType';

type YaDevicePropertyBase = {
    state: YaDevicePropertyState;
    last_updated: number;
}

export type YaDevicePropertyFloat = YaDevicePropertyBase & {
    type: YaDevicePropertyType.Float;
    parameters: YaDevicePropertyParametersFloat;
}

export type YaDevicePropertyEvent = YaDevicePropertyBase & {
    type: YaDevicePropertyType.Event;
    parameters: YaDevicePropertyParametersEvent;
}

export type YaDeviceProperty = YaDevicePropertyFloat | YaDevicePropertyEvent;
