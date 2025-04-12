import type { DeviceActionResult } from '@homemap/shared';

import type { YaDeviceActionsResult } from '../yaClient/model/YaDeviceActionsResult';
import { YaDeviceCapabilityInstance } from '../yaClient/model/YaDeviceCapabilityInstance';
import { YaDeviceCapabilityType } from '../yaClient/model/YaDeviceCapabilityType';

export const mapYaDeviceActionsResultToDeviceActionsResult = (yaActionsResult: YaDeviceActionsResult): DeviceActionResult => {
    const actionResult: DeviceActionResult = {
        id: yaActionsResult.id,
        status: {},
    };

    for (const capability of yaActionsResult.capabilities) {
        if (capability.state?.action_result?.status == undefined) {
            continue;
        }

        switch (capability.type) {
            case YaDeviceCapabilityType.OnOff: {
                if (capability.state.instance === YaDeviceCapabilityInstance.On) {
                    actionResult.status.on = capability.state.action_result.status;
                }
                break;
            }
            case YaDeviceCapabilityType.Range: {
                if (capability.state.instance === YaDeviceCapabilityInstance.Brightness) {
                    actionResult.status.brightness = capability.state.action_result.status;
                }
                break;
            }
        }
    }

    return actionResult;
}
