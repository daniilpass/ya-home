import { Device } from '../devices';
import { DeviceTypes } from '../deviceTypes/DeviceTypes';
import { SwitchableDevice, switchableDeviceTypes, SwitchableDeviceTypes } from './SwitchableDevice';

export const isSwitchableDevice = (device: Device) : device is SwitchableDevice => {
    return isSwitchableDeviceType(device.type);
}

export const isSwitchableDeviceType = (deviceType: DeviceTypes): deviceType is SwitchableDeviceTypes => {
    return switchableDeviceTypes.includes(deviceType as any);
}
