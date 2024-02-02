import { DeviceState } from '@homemap/shared';

import { YaDeviceCapability } from '../yaClient/model/YaDeviceCapability';

export const mapYaCapabilitiesToState = (yaCapabilites: YaDeviceCapability[]): DeviceState => {
    let state: DeviceState = {}

    for (const capability of yaCapabilites) {
        if (capability.state?.value == undefined) {
            continue;
        }

        switch (capability.type) {
            case 'devices.capabilities.on_off': {
                if (capability.state.instance === 'on') {
                    state.on = capability.state.value as DeviceState['on'];
                }
                break;
            }
            case 'devices.capabilities.range': {
                if (capability.state.instance === 'brightness') {
                    state.brightness = capability.state.value as DeviceState['brightness'];
                }
                break;
            }
        }
    }

    return state;
}
