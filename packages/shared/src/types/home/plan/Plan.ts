import { Collection } from '../../global';
import { PlanBackground } from './PlanBackground';
import { PlanDevice } from './PlanDevice';

export type Plan = {
    width: number;
    height: number;
    background: PlanBackground,
    devices: Collection<PlanDevice>;
}