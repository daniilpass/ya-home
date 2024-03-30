import { YaDevice } from '../YaDevice'
import { YaBaseResponse } from './YaBaseReponse';

export type YaUserInfoResponse = YaBaseResponse & {
    devices: YaDevice[];
}