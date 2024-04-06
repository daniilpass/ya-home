import { DeviceUnits } from '../DeviceUnits';

export enum DeviceStateKeys {
    On = 'on',
    Brightness = 'brightness',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Motion = 'motion',
}

export type DeviceStateType<T> = {
    value: T,
    unit: DeviceUnits,
    updatedAt?: number,
}

export type DeviceStateOnOf = {
    [DeviceStateKeys.On]: DeviceStateType<boolean>;
}

export type DeviceStateBrightness = {
    [DeviceStateKeys.Brightness]: DeviceStateType<number>;
}

export type DeviceStateTemperature = {
    [DeviceStateKeys.Temperature]: DeviceStateType<number>;
}

export type DeviceStateHumidity = {
    [DeviceStateKeys.Humidity]: DeviceStateType<number>;
}

export type DeviceStateMotion = {
    [DeviceStateKeys.Motion]: DeviceStateType<number>;
}

export type DeviceState = Partial<
    DeviceStateOnOf &
    DeviceStateBrightness &
    DeviceStateTemperature &
    DeviceStateHumidity &
    DeviceStateMotion
>;
