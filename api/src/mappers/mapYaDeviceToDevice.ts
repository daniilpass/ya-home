import { Device, DeviceTypes } from '@homemap/shared/index.js';

import { YaDevice } from '../yaClient/model/YaDevice.js';
import { mapYaCapabilitiesToState } from './mapYaCapabilitiesToState.js';

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
