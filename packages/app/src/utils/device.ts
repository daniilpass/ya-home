import { DeviceStateKeys, DeviceStateType, DeviceSubtypes, DeviceTypes, DeviceUnits, MotionValue, UNICODE } from '@homemap/shared';
import { DeviceIconName } from '../components/DeviceIcon';
import { defaultSensorColor, recentMotionIntervalMs } from './constants';
import { getDateString, getStartOfTheDay, getTimeString } from './date';

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
        case DeviceTypes.Socket:
            return 'Розетка';
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
            return UNICODE.celsius
        case DeviceUnits.Kelvin:
            return UNICODE.kelvin
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
        case DeviceTypes.Socket:
            return DeviceIconName.Socket;
        case DeviceTypes.Unknown:
        default:
            return DeviceIconName.Unknown;
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
        case DeviceStateKeys.Motion:
            return DeviceIconName.Motion;
        default:
            return null;
    }
}

const roundSensorValue = (value: number) => Math.round(value * 10) / 10;

const getMotionsSensorValue = (state: DeviceStateType<MotionValue>) => {
    switch (state.value) {
        case MotionValue.detected:
            const startOfTheDay = getStartOfTheDay();
            const eventDate = new Date(state.updatedAt);
            const detectedToday = eventDate >= startOfTheDay;
            // const recentMotion = Date.now() - state.updatedAt <= recentMotionIntervalMs;
            if (detectedToday) {
                return getTimeString(eventDate);
            } else {
                return getDateString(eventDate);
            }
        case MotionValue.notDetected:
        default:
            return UNICODE.enDash;
    }
    
}

export const getSensorStateValue = (stateKey: DeviceStateKeys, state: DeviceStateType): unknown => {
    switch (stateKey) {
        case DeviceStateKeys.Temperature:
            return roundSensorValue(+state.value!);
        case DeviceStateKeys.Motion:
            return getMotionsSensorValue(state as DeviceStateType<MotionValue>);
        case DeviceStateKeys.On:
        case DeviceStateKeys.Brightness:
        case DeviceStateKeys.Humidity:
        default:
            return state.value;
    }
}

export const getSensorColor = (stateKey: DeviceStateKeys, state: DeviceStateType) => {
    switch (stateKey) {
        case DeviceStateKeys.Motion:
            const recentMotion = Date.now() - state.updatedAt <= recentMotionIntervalMs;
            if (recentMotion) {
                return '#92ff92';
            }
            return defaultSensorColor;
        case DeviceStateKeys.Temperature:
        case DeviceStateKeys.On:
        case DeviceStateKeys.Brightness:
        case DeviceStateKeys.Humidity:
        default:
            return defaultSensorColor;
    }
}
