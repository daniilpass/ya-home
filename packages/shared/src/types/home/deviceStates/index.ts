export type DeviceStateOnOf = {
    on: boolean;
}

export type DeviceStateBrightness = {
    brightness: number;
}

export type DeviceState = Partial<
    DeviceStateOnOf &
    DeviceStateBrightness
>;
