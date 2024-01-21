import { DeviceType } from './model/DeviceType';

export const isSupportedDevice = (type: string) =>
    Object.values(DeviceType).includes(type as DeviceType);