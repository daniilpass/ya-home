import { Collection } from '../../global';
import { PlanBackground } from './PlanBackground';
import { PlanDevice } from './PlanDevice';

export type Plan = {
    id: number;
    width: number;
    height: number;
    background: PlanBackground,
    devices: Collection<PlanDevice>;
}