import type { DeviceState } from '@homemap/shared';
import { DeviceUnits } from '@homemap/shared';

import type { YaDeviceCapability } from '../yaClient/model/YaDeviceCapability';
import { YaDeviceCapabilityInstance } from '../yaClient/model/YaDeviceCapabilityInstance';
import { YaDeviceCapabilityType } from '../yaClient/model/YaDeviceCapabilityType';

import { mapYaDeviceUnitToDeviceUnit } from './mapYaDeviceUnitToDeviceUnit';

export const mapYaCapabilitiesToState = (yaCapabilites: YaDeviceCapability[]): DeviceState => {
    const state: DeviceState = {};

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
                    };
                }
                break;
            }
            case YaDeviceCapabilityType.Range: {
                if (capability.state.instance === YaDeviceCapabilityInstance.Brightness) {
                    state.brightness = {
                        value: Number(capability.state.value),
                        unit: DeviceUnits.Percent,
                        updatedAt,
                    };
                } else if (capability.state.instance === YaDeviceCapabilityInstance.Temperature) {
                    const unit: DeviceUnits = capability.parameters.unit ? mapYaDeviceUnitToDeviceUnit(capability.parameters.unit) : DeviceUnits.Default;
                    state.targetTemperature = {
                        value: Number(capability.state.value),
                        unit,
                        updatedAt,
                    };
                }
                break;
            }
        }
    }

    return state;
};
