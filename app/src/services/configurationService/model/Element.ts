import { Device } from '../../../api/model/Device';
import { Point } from '../../../common/types';
import { Area } from './Area';

export type Element = 
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        iconSrc?: string;
        icon?: string;
        position: Point;
        area?: Area;
    };

export type ElementCollection = Record<string, Element>;
