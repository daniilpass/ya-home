import { DeviceActionResult, DeviceState } from '@homemap/shared';

import { YaDeviceActionsResult } from '../yaClient/model/YaDeviceActionsResult';

export const mapYaDeviceActionsResultToDeviceActionsResult = (yaActionsResult: YaDeviceActionsResult): DeviceActionResult => {
    let actionResult: DeviceActionResult = {
        id: yaActionsResult.id,
        status: {},
    };

    for (const capability of yaActionsResult.capabilities) {
        if (capability.state?.action_result?.status == undefined) {
            continue;
        }

        switch (capability.type) {
            case 'devices.capabilities.on_off': {
                if (capability.state.instance === 'on') {
                    actionResult.status.on = capability.state.action_result.status;
                }
                break;
            }
            case 'devices.capabilities.range': {
                if (capability.state.instance === 'brightness') {
                    actionResult.status.brightness = capability.state.action_result.status;
                }
                break;
            }
        }
    }

    return actionResult;
}
