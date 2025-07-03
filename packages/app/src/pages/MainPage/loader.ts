import { redirect } from 'react-router-dom';

import type { Collection, PlanInfo } from '@homemap/shared';

import type { LoaderResponse } from '../../app/types';
import ApiClient from '../../api';
import { routes } from '../../app/router';
import { store } from '../../store';

export async function mainPageLoader(): Promise<LoaderResponse | Response> {
    try {
        const planIds = await ApiClient
            .getPlans()
            .then((planInfos: Collection<PlanInfo>) => {
                return Object.keys(planInfos);
            });

        if (planIds.length > 0) {
            return redirect(`${routes.view}/${planIds[0]}`);
        }

        return { success: true, data: undefined };
    } catch {
        store.dispatch.dialog.crash('Не удалось загрузить список планов');

        return {
            success: false,
            data: undefined,
        };
    }
}