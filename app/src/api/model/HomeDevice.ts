import {Device} from './Device';

export type HomeDevice =
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        state?: string;
    };

export type HomeDeviceCollection = Record<string, HomeDevice>;
