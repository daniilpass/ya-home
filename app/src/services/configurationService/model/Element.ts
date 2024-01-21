import {Device} from '../../../api/model/Device';
import {Area} from './Area';
import {Position} from './Position';

export type Element = 
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        iconSrc?: string;
        icon?: string;
        position: Position;
        area?: Area;
    };

export type ElementCollection = Record<string, Element>;
