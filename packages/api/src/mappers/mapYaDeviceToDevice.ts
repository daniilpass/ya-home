import type { Device} from '@homemap/shared';
import { DeviceSubtypes, DeviceTypes } from '@homemap/shared';

import type { YaDevice } from '../yaClient/model/YaDevice';
import { mapYaCapabilitiesToState } from './mapYaCapabilitiesToState';
import { mapYaPropertiesToState } from './mapYaPropertiesToState';
import { mapYaDeviceTypeToDeviceType, mapYaDeviceTypeToSubtype } from './deviceType';

export const mapYaDeviceToDevice = (yaDevice: YaDevice): Device => {
    let type = mapYaDeviceTypeToDeviceType(yaDevice.type);
    let subtype = mapYaDeviceTypeToSubtype(yaDevice.type);
    const capabilitiesState = mapYaCapabilitiesToState(yaDevice.capabilities);
    const propertiesState = mapYaPropertiesToState(yaDevice.properties);
    const state = {
        ...capabilitiesState,
        ...propertiesState,
    };

    if (Object.keys(state).length === 0) {
        type = DeviceTypes.Unknown;
        subtype = DeviceSubtypes.Unknown;
    }

    return {
        id: yaDevice.id,
        name: yaDevice.name,
        type,
        subtype,
        state,
    };
};
