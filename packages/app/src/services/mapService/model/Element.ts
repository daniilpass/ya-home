import { Device } from '@homemap/shared';
import {Substate} from './Substate';

export type Element = {
    id: Device['id'];
    name: Device['name'];
    type: Device['type'];
    state?: Device['state'];
    substate?: Substate;
    updatedAt?: number;
}
