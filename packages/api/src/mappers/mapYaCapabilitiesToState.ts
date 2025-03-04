import { DeviceState, DeviceUnits } from '@homemap/shared';

import { YaDeviceCapability } from '../yaClient/model/YaDeviceCapability';
import { YaDeviceCapabilityInstance } from '../yaClient/model/YaDeviceCapabilityInstance';
import { YaDeviceCapabilityType } from '../yaClient/model/YaDeviceCapabilityType';

export const mapYaCapabilitiesToState = (yaCapabilites: YaDeviceCapability[]): DeviceState => {
    let state: DeviceState = {};

    for (const capability of yaCapabilites) {
        if (capability.state?.value === undefined) {
            continue;
        }
    
        const updatedAt: number = capability.state_changed_at * 1000;

        switch (capability.type) {
            case YaDeviceCapabilityType.OnOff: {
                if (capability.state.instance === YaDeviceCapabilityInstance.On) {
                    state.on = {
                        value: Boolean(capability.state.value),
                        unit: DeviceUnits.Boolean,
                        updatedAt,
                    }
                }
                break;
            }
            case YaDeviceCapabilityType.Range: {
                if (capability.state.instance === YaDeviceCapabilityInstance.Brightness) {
                    state.brightness = {
                        value: Number(capability.state.value),
                        unit: DeviceUnits.Percent,
                        updatedAt,
                    }
                }
                break;
            }
        }
    }

    return state;
}
