enum DeviceIconLight {
    Light = 'bulb',
    Chandelier = 'chandelier',
    LED = 'led',
}

enum DeviceIconElecticity {
    Socket = 'socket',
    Cord = 'cord',
}

enum DeviceIconMedia {
    Projector = 'projector',
    TV = 'tv',
}
enum DeviceIconHousehold {
    Fan = 'fan',
    AC = 'ac',
}

enum DeviceIconSensors {
    Sensor = 'sensor',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Motion = 'motion',
}

enum DeviceIconExtra {
    Blank = 'blank',
    Unknown = 'unknown',
}

export const deviceIcons = {
    ...DeviceIconLight,
    ...DeviceIconElecticity,
    ...DeviceIconMedia,
    ...DeviceIconHousehold,
    ...DeviceIconSensors,
    ...DeviceIconExtra,
};

export type DeviceIconType =
    DeviceIconLight |
    DeviceIconElecticity |
    DeviceIconMedia |
    DeviceIconHousehold |
    DeviceIconSensors |
    DeviceIconExtra;
