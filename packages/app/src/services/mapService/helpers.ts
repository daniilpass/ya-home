
import type { DeviceState } from '@homemap/shared';

// Compare meaningful  properties of state
export const stateIsEqual = (elementState: DeviceState | undefined, deviceState: DeviceState) => {
    if (!elementState) {
        return false;
    }

    const elementStateKeys = Object.keys(elementState) as Array<keyof DeviceState>;
    const deviceStateKeys = Object.keys(elementState) as Array<keyof DeviceState>;;

    if (elementStateKeys.length !== deviceStateKeys.length) {
        return false;
    }

    for (const stateKey of elementStateKeys) {
        const stateValueIsEqual = elementState[stateKey]?.value === deviceState[stateKey]?.value
        if (!stateValueIsEqual) {
            return false;
        }
    }

    return true;
}
