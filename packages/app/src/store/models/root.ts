import { Models } from '@rematch/core';

import { alerts } from './alert';

export interface RootModel extends Models<RootModel> {
    alerts: typeof alerts;
}

export const models: RootModel = {
    alerts,
}