import type { Plan } from '@homemap/shared';

import type { LoaderResponse } from '../../app/types';
import ApiClient from '../../api';
import { store } from '../../store';

export async function viewPageLoader({ params }: { 
    params: {
        id?: string
    }
}): Promise<LoaderResponse<Plan>> {
    try {
        const planId = Number(params.id);
        const plan = await ApiClient.getPlan(planId);

        return {
            success: true,
            data: plan,
        };
    } catch {
        store.dispatch.dialog.crash('Не удалось загрузить план');

        return {
            success: false,
            data: undefined,
        };
    }
}