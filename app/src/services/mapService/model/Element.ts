import {HomeDevice} from '../../../api/model/HomeState';
import {Substate} from './Substate';

export type Element = HomeDevice & {
    // id: string;
    // name: string;
    // type: string;
    // state?: string;
    // entity: string;
    substate?: Substate;
    updatedAt?: number;
    condition?: Record<string, any>;
}
