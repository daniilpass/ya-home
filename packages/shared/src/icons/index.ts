enum DeviceIconDefault {
    Ligth = 'bulb',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Sensor = 'sensor',
    Motion = 'motion',
    Socket = 'socket',
    Unknown = 'unknown',
};

enum DeviceIconExtra {
    Blank = 'blank',
};

export const deviceIcons = {
    ...DeviceIconDefault,
    ...DeviceIconExtra,
};

export type DeviceIconType = DeviceIconDefault | DeviceIconExtra;

