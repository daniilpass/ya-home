import type { YaDevice } from '../YaDevice'
import type { YaBaseResponse } from './YaBaseReponse';

export type YaUserInfoResponse = YaBaseResponse & {
    devices: YaDevice[];
}