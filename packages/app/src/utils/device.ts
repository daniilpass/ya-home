import { DeviceStateKeys, DeviceStateType, DeviceSubtypes, DeviceTypes, DeviceUnits } from '@homemap/shared';
import { DeviceIconName } from '../components/DeviceIcon';

export const sensorSubtypeToName = (subtype: DeviceSubtypes) => {
    switch (subtype) {
        case DeviceSubtypes.Motion:
            return 'Датчик движения';
        case DeviceSubtypes.Climate:
            return 'Датчик климата';
        case DeviceSubtypes.None:
        case DeviceSubtypes.Unknown:
        default:
            return 'Датчик';
    }

}

export const deviceTypeToName = (type: DeviceTypes, subtype: DeviceSubtypes) => {
    switch (type) {
        case DeviceTypes.Light:
            return 'Свет';
        case DeviceTypes.Switch:
            return 'Выключатель';
        case DeviceTypes.Sensor:
            return sensorSubtypeToName(subtype);
        case DeviceTypes.Unknown:
        default:
            return 'Неизвестное устройство';
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

export const getDeviceDefaultIcon = (type: DeviceTypes): DeviceIconName | undefined => {
    switch (type) {
        case DeviceTypes.Switch:
        case DeviceTypes.Light:
            return DeviceIconName.Ligth;
        case DeviceTypes.Sensor:
            return DeviceIconName.Sensor;
        case DeviceTypes.Unknown:
        default:
            return undefined;
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