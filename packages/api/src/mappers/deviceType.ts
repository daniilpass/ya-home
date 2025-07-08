import { DeviceTypes, DeviceSubtypes } from '@homemap/shared';

import { YaDeviceType } from '../yaClient/model/YaDeviceType';

export const mapYaDeviceTypeToDeviceType = (type: YaDeviceType): DeviceTypes => {
    switch (type) {
        case YaDeviceType.Light:
            return DeviceTypes.Light;
        case YaDeviceType.Switch:
            return DeviceTypes.Switch;
        case YaDeviceType.Socket:
            return DeviceTypes.Socket;
        case YaDeviceType.Sensor:
        case YaDeviceType.ClimateSensor:
        case YaDeviceType.MotionSensor:
            return DeviceTypes.Sensor;
        case YaDeviceType.ThermostatAC:
            return DeviceTypes.AC;
        default:
            return DeviceTypes.Unknown;
    }
};

export const mapYaDeviceTypeToSubtype = (type: YaDeviceType): DeviceSubtypes => {
    switch (type) {
        case YaDeviceType.ClimateSensor:
            return DeviceSubtypes.Climate;
        case YaDeviceType.MotionSensor:
            return DeviceSubtypes.Motion;  
        case YaDeviceType.Light:
        case YaDeviceType.Switch:
        case YaDeviceType.Socket:
        case YaDeviceType.ThermostatAC:
            return DeviceSubtypes.None;
        default:
            return DeviceSubtypes.Unknown;
    }
};