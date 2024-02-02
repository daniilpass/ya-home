import { Point } from '../../geom';
import { Device } from '../devices';
import { PlanDeviceArea } from './PlanDeviceArea';

export type PlanDevice = 
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        position: Point;
        icon?: string;
        area?: PlanDeviceArea;
    };
