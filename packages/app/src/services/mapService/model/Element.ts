import { Device, DeviceState, DeviceSubtypes, DeviceTypes } from '@homemap/shared';
import {Substate} from './Substate';

export type Element = {
    id: Device['id'];
    name: Device['name'];
    type: DeviceTypes;
    subtype: DeviceSubtypes;
    state?: DeviceState;
    substate?: Substate;
    updatedAt?: number;
}
