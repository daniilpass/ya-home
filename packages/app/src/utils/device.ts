import { DeviceStateKeys, DeviceStateType, DeviceTypes, DeviceUnits } from '@homemap/shared';
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
        case DeviceStateKeys.Humidity:
            return DeviceIconName.Humidity;
        default:
            return null;
    }
}

const roundSensorValue = (value: number) => Math.round(value * 10) / 10;

export const getSensorStateValue = (stateKey: DeviceStateKeys, state: DeviceStateType): unknown => {
    switch (stateKey) {
        case DeviceStateKeys.Temperature:
            return roundSensorValue(+state.value!)
        case DeviceStateKeys.On:
        case DeviceStateKeys.Brightness:
        case DeviceStateKeys.Humidity:
        case DeviceStateKeys.Motion:
        default:
            return state.value;
    }
}