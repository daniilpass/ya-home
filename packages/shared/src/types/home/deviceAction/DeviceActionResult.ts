import { DeviceState } from '../deviceStates';

type DeviceActionStatus = {
    [K in keyof DeviceState]: 'DONE' | 'ERROR';
}

export type DeviceActionResult = {
    id: string;
    status: DeviceActionStatus;
}