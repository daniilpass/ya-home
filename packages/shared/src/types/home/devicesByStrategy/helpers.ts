import type { Device } from '../devices';
import type { DeviceTypes } from '../deviceTypes/DeviceTypes';

import type { SwitchableDevice, SwitchableDeviceTypes } from './SwitchableDevice';
import { switchableDeviceTypes } from './SwitchableDevice';

export const isSwitchableDevice = (device: Device) : device is SwitchableDevice => {
    return isSwitchableDeviceType(device.type);
};

export const isSwitchableDeviceType = (deviceType: DeviceTypes): deviceType is SwitchableDeviceTypes => {
    return switchableDeviceTypes.includes(deviceType as SwitchableDeviceTypes);
};
