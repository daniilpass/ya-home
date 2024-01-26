import {Element} from './Element';
import { Plan } from './Plan';

export type Configuration = {
    plan: Plan;
    elements: Record<string, Element>;
}
