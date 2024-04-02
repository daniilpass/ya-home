import { DeviceAction, DeviceState, Entries } from '@homemap/shared';
import { YaDeviceActions } from '../yaClient/model/YaDeviceActions';
import { YaDeviceCapability } from '../yaClient/model/YaDeviceCapability';
import { YaDeviceCapabilityInstance } from '../yaClient/model/YaDeviceCapabilityInstance';
import { YaDeviceCapabilityType } from '../yaClient/model/YaDeviceCapabilityType';

export const mapDeviceActionToYaDevicesActions = (deviceAction: DeviceAction): YaDeviceActions => {
    const actions: YaDeviceCapability[] = [];
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
                })
                break;
            default:
                break;
        }      
    }

    return {
        id: deviceAction.id,
        actions,
    }
}