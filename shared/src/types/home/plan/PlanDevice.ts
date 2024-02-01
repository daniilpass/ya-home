import { Point } from '../../geom/index.js';
import { Device } from '../devices/index.js';
import { PlanDeviceArea } from './PlanDeviceArea.js';

export type PlanDevice = 
    & Pick<Device, 'id' | 'name' | 'type'>
    & {
        position: Point;
        icon?: string;
        area?: PlanDeviceArea;
    };
