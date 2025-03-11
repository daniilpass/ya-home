
import isEqual from 'lodash.isequal';

import { DeviceState } from '@homemap/shared';
import omit from 'lodash.omit';

const ignorableStateProps = [
    'updatedAt'
]

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
        const statePropertyIsEqual = isEqual(
            omit(elementState[stateKey], ignorableStateProps),
            omit(deviceState[stateKey], ignorableStateProps),
        );

        if (!statePropertyIsEqual) {
            return false;
        }
    }

    return true;
}
