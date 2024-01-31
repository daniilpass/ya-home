import { YaDevice } from '../YaDevice.js'
import { YaBaseResponse } from './YaBaseReponse.js';

export type YaUserInfoResponse = YaBaseResponse & {
    devices: YaDevice[];
}