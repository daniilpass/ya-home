import { Device, DeviceTypes } from '@homemap/shared';

import { YaDevice } from '../yaClient/model/YaDevice';
import { mapYaCapabilitiesToState } from './mapYaCapabilitiesToState';

export const mapYaDeviceToDevice = (yaDevice: YaDevice): Device => {
    const type = yaDevice.type.replace('devices.types.', '');

    switch(type) {
        case DeviceTypes.Light:
            return {
                id: yaDevice.id,
                name: yaDevice.name,
                type: DeviceTypes.Light,
                state: mapYaCapabilitiesToState(yaDevice.capabilities),
            }
        case DeviceTypes.Switch:
            return {
                id: yaDevice.id,
                name: yaDevice.name,
                type: DeviceTypes.Switch,
                state: mapYaCapabilitiesToState(yaDevice.capabilities),
            }
        case DeviceTypes.Unknown:
        default:
            return {
                id: yaDevice.id,
                name: yaDevice.name,
                type: DeviceTypes.Unknown,
            }
    }
}
