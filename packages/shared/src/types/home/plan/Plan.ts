import { Collection } from '../../global/index.js';
import { PlanBackground } from './PlanBackground.js';
import { PlanDevice } from './PlanDevice.js';

export type Plan = {
    width: number;
    height: number;
    background: PlanBackground,
    devices: Collection<PlanDevice>;
}