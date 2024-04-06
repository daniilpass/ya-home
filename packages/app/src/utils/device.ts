import { DeviceStateKeys, DeviceTypes, DeviceUnits } from '@homemap/shared';
import { DeviceIconName } from '../components/DeviceIcon';


export const deviceTypeToName = (type: DeviceTypes) => {
    switch (type) {
        case DeviceTypes.Light:
            return 'Свет';
        case DeviceTypes.Switch:
            return 'Выключатель';
        case DeviceTypes.Unknown:
        default:
            return 'Неизвестный';
    }
}

export const getDeviceUnitTitle = (unit: DeviceUnits) => {
    switch (unit) {
        case DeviceUnits.Celsius:
            return '\u2103';
        case DeviceUnits.Kelvin:
            return '\u212A';
        case DeviceUnits.Percent:
            return '%';
        case DeviceUnits.Boolean:
        case DeviceUnits.Default:
        default:
            return '';
    }
}

export const getDeviceStateIcon = (stateKey: DeviceStateKeys): DeviceIconName | null => {
    switch (stateKey) {
        case DeviceStateKeys.On:
            return DeviceIconName.Ligth;
        case DeviceStateKeys.Temperature:
            return DeviceIconName.Temperature;
        default:
            return null;
    }
}