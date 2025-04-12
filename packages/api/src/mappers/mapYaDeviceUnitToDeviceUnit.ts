import { DeviceUnits } from '@homemap/shared';
import { YaDeviceUnit } from '../yaClient/model/YaDeviceUnit';

export const mapYaDeviceUnitToDeviceUnit = (yaDeviceUnit: YaDeviceUnit): DeviceUnits => {
    switch(yaDeviceUnit) {
        case YaDeviceUnit.Percent: return DeviceUnits.Percent;
        case YaDeviceUnit.Celsius: return DeviceUnits.Celsius;
        case YaDeviceUnit.Kelvin: return DeviceUnits.Kelvin;
        default: return DeviceUnits.Default;
    }
};