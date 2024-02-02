import { DeviceAction, DeviceState, Entries } from '@homemap/shared';
import { YaDeviceActions } from '../yaClient/model/YaDeviceActions';
import { YaDeviceCapability } from '../yaClient/model/YaDeviceCapability';

export const mapDeviceActionToYaDevicesActions = (deviceAction: DeviceAction): YaDeviceActions => {
    const actions: YaDeviceCapability[] = [];
    const stateEntries = Object.entries(deviceAction.state) as Entries<DeviceState>;

    for (const [stateKey, stateValue] of stateEntries) {
        switch (stateKey) {
            case 'on':
                actions.push({
                    type: 'devices.capabilities.on_off',
                    state: {
                        instance: stateKey,
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