import { DeviceState } from './index.js';

export type DeviceAction = {
    id: string;
    state: DeviceState;
}