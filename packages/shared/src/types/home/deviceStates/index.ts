export type DeviceStateOnOf = {
    on: 'on' | 'off';
}

export type DeviceStateBrightness = {
    brightness: number;
}

export type DeviceState = Partial<
    DeviceStateOnOf &
    DeviceStateBrightness
>;
