import type { Collection } from '../../global';
import type { PlanBackground } from './PlanBackground';
import type { PlanDevice } from './PlanDevice';

export type Plan = {
    id: number;
    width: number;
    height: number;
    background: PlanBackground,
    devices: Collection<PlanDevice>;
}