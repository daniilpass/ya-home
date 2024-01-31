import { YaDeviceActionsResult } from '../YaDeviceActionsResult.js';
import { YaBaseResponse } from './YaBaseReponse.js';

export type YaDevicesActionsResponse = YaBaseResponse & {
    devices: YaDeviceActionsResult[];
};