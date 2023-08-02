import {Device} from './Device';

type HomeDevice =
 & Pick<Device, 'id' | 'name' | 'type'>
 & {
    state: string | null;
 };

export type HomeState = Record<string, HomeDevice>;
