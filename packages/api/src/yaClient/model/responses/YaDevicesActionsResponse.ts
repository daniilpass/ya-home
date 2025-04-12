import type { YaDeviceActionsResult } from '../YaDeviceActionsResult';

import type { YaBaseResponse } from './YaBaseReponse';

export type YaDevicesActionsResponse = YaBaseResponse & {
    devices: YaDeviceActionsResult[];
};