import type { Models } from '@rematch/core';

import { alerts } from './alert';
import { dialog } from './dialog';

export interface RootModel extends Models<RootModel> {
    alerts: typeof alerts;
    dialog: typeof dialog;
}

export const models: RootModel = {
    alerts,
    dialog,
};