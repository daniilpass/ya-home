import {HomeDevice} from '../../../api/model/HomeDevice';
import {Substate} from './Substate';

export type Element = HomeDevice & {
    substate?: Substate;
    updatedAt?: number;
    condition?: Record<string, any>;
}
