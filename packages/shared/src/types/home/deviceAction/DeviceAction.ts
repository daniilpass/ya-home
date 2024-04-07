import { DeviceStateKeys } from '../deviceStates';

export type DeviceActionState = Partial<Record<DeviceStateKeys, unknown>>;

export type DeviceAction = {
    id: string;
    state: DeviceActionState;
}
