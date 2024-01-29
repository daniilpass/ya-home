import { Device } from '../../../api/model/Device';
import { Point } from '../../../common/types';
import { DeviceIconName } from '../../../components/DeviceIcon';
import { Area } from './Area';

export type Element = 
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        icon?: DeviceIconName;
        position: Point;
        area?: Area;
    };

export type ElementCollection = Record<string, Element>;
