import { DeviceTypes } from './DeviceTypes.js';

export const isValidDeviceType = (type: string): type is DeviceTypes => {
    return Object.values(DeviceTypes).includes(type as DeviceTypes);
}