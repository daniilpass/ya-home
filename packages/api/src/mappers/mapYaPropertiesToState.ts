import type { DeviceState, MotionValue } from '@homemap/shared';
import { DeviceUnits } from '@homemap/shared';

import type { YaDeviceProperty, YaDevicePropertyEvent, YaDevicePropertyFloat } from '../yaClient/model/YaDeviceProperty';
import { YaDevicePropertyType } from '../yaClient/model/YaDevicePropertyType';
import { YaDevicePropertyInstance } from '../yaClient/model/YaDevicePropertyInstance';
import { mapYaDeviceUnitToDeviceUnit } from './mapYaDeviceUnitToDeviceUnit';

const mapYaPropertyToState = (property: YaDevicePropertyFloat | YaDevicePropertyEvent): DeviceState | null => {
    const state: DeviceState = {};
    const unit: DeviceUnits = 'unit' in property.parameters ? mapYaDeviceUnitToDeviceUnit(property.parameters.unit) : DeviceUnits.Default;
    const updatedAt: number = property.last_updated * 1000;

    switch (property.parameters.instance) {
        case YaDevicePropertyInstance.Humidity: {
            state.humidity = {
                value: Number(property.state.value),
                unit,
                updatedAt,
            };
            break;
        }
        case YaDevicePropertyInstance.Temperature: {
            state.temperature = {
                value: Number(property.state.value),
                unit,
                updatedAt,
            };
            break;
        }
        case YaDevicePropertyInstance.Motion: {
            state.motion = {
                value: <MotionValue>property.state.value,
                unit,
                updatedAt,
            };
            break;
        }
    }

    return state;
};

export const mapYaPropertiesToState = (yaProperties: YaDeviceProperty[]): DeviceState => {
    const state: DeviceState = {};

    for (const property of yaProperties) {
        if (property.state?.value === undefined) {
            continue;
        }

        switch (property.type) {
            case YaDevicePropertyType.Event:
            case YaDevicePropertyType.Float: {
                const mappedState = mapYaPropertyToState(property);
                if (mappedState) {
                    Object.assign(state, mappedState);
                }
                break;
            }
        }
    }

    return state;
};
