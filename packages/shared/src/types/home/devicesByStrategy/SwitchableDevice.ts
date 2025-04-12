import type { DeviceBase } from '../devices/DeviceBase';
import type { DeviceStateOnOf } from '../deviceStates';
import { DeviceTypes } from '../deviceTypes/DeviceTypes';

export const switchableDeviceTypes = [
    DeviceTypes.Light,
    DeviceTypes.Switch,
    DeviceTypes.Socket,
] as const;

export type SwitchableDeviceTypes = typeof switchableDeviceTypes[number];

export type SwitchableDevice = DeviceBase & {
    type: SwitchableDeviceTypes,
    state: Partial<DeviceStateOnOf>,
};