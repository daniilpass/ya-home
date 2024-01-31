import { DeviceState } from '../deviceStates/index.js';

export type DeviceAction = {
    id: string;
    state: DeviceState;
}
