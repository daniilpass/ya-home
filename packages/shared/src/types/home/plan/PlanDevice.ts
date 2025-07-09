import type { Orientation, Point } from '../../geom';
import type { Device } from '../devices';

import type { PlanDeviceArea } from './PlanDeviceArea';

export type PlanDevice = 
    & Pick<Device, 'id' | 'name' | 'type' | 'subtype'>
    & {
        position: Point;
        orientation?: Orientation;
        icon?: string;
        area?: PlanDeviceArea;
    };
