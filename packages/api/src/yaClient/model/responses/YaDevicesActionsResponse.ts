import { YaDeviceActionsResult } from '../YaDeviceActionsResult';
import { YaBaseResponse } from './YaBaseReponse';

export type YaDevicesActionsResponse = YaBaseResponse & {
    devices: YaDeviceActionsResult[];
};