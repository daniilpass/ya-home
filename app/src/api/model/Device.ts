import {Capability} from './Capability';

export interface Device {
    id: string;
    name: string;
    type: string;
    capabilities: Capability[],
}

export interface DeviceCollection {
    devices: Array<Device>;
}
