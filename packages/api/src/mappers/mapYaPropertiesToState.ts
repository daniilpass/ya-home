import { DeviceState, DeviceUnits } from '@homemap/shared';

import { YaDeviceProperty, YaDevicePropertyEvent, YaDevicePropertyFloat } from '../yaClient/model/YaDeviceProperty';
import { YaDevicePropertyType } from '../yaClient/model/YaDevicePropertyType';
import { YaDevicePropertyInstance } from '../yaClient/model/YaDevicePropertyInstance';
import { mapYaDeviceUnitToDeviceUnit } from './mapYaDeviceUnitToDeviceUnit';

const mapYaPropertyFloatToState = (property: YaDevicePropertyFloat): DeviceState | null => {
    let state: DeviceState = {};
    const unit: DeviceUnits = mapYaDeviceUnitToDeviceUnit(property.parameters.unit);

    // TODO: add last_updated to state
    switch (property.parameters.instance) {
        case YaDevicePropertyInstance.Humidity: {
            state.humidity = {
                value: Number(property.state.value),
                unit,
            }
            break;
        }
        case YaDevicePropertyInstance.Temperature: {
            state.temperature = {
                value: Number(property.state.value),
                unit,
            }
            break;
        }
    }

    return state;
}

export const mapYaPropertiesToState = (yaProperties: YaDeviceProperty[]): DeviceState => {
    let state: DeviceState = {};

    for (const property of yaProperties) {
        if (property.state?.value === undefined) {
            continue;
        }

        switch (property.type) {
            case YaDevicePropertyType.Float: {
                const mappedState = mapYaPropertyFloatToState(property);
                if (mappedState) {
                    Object.assign(state, mappedState);
                }
                break;
            }
            case YaDevicePropertyType.Event: {
                //TODO: implement
                break;
            }
        }
    }

    return state;
}
