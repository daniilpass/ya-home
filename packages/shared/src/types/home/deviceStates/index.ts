import { DeviceUnits } from '../DeviceUnits';

type DeviceStateType<T> = {
    value: T,
    unit: DeviceUnits,
    updatedAt?: number,
}

export type DeviceStateOnOf = {
    on: DeviceStateType<boolean>;
}

export type DeviceStateBrightness = {
    brightness: DeviceStateType<number>;
}

export type DeviceStateTemperature = {
    temperature: DeviceStateType<number>;
}

export type DeviceStateHumidity = {
    humidity: DeviceStateType<number>;
}

export type DeviceStateMotion = {
    motion: DeviceStateType<number>;
}

export type DeviceState = Partial<
    DeviceStateOnOf &
    DeviceStateBrightness &
    DeviceStateTemperature &
    DeviceStateHumidity &
    DeviceStateMotion
>;

export type DeviceStateKeys = keyof DeviceState;