import type { DeviceAction, DeviceState, Entries } from '@homemap/shared';

import type { YaDeviceAction, YaDeviceActions } from '../yaClient/model/YaDeviceActions';
import { YaDeviceCapabilityInstance } from '../yaClient/model/YaDeviceCapabilityInstance';
import { YaDeviceCapabilityType } from '../yaClient/model/YaDeviceCapabilityType';

export const mapDeviceActionToYaDevicesActions = (deviceAction: DeviceAction): YaDeviceActions => {
    const actions: YaDeviceAction[] = [];
    const stateEntries = Object.entries(deviceAction.state) as Entries<DeviceState>;

    for (const [stateKey, stateValue] of stateEntries) {
        switch (stateKey) {
            case 'on':
                actions.push({
                    type: YaDeviceCapabilityType.OnOff,
                    state: {
                        instance: YaDeviceCapabilityInstance.On,
                        value: stateValue,
                    },
                });
                break;
            default:
                break;
        }      
    }

    return {
        id: deviceAction.id,
        actions,
    };
};