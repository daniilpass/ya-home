
import { useLoaderData } from 'react-router-dom';

import type { Plan } from '@homemap/shared';

import HomeMap from '../../widgets/HomeMap';
import DemoBanner from '../../widgets/DemoBanner';
import type { LoaderResponse } from '../../app/types';

import './style.css';

export const ViewPage = () => {
    const { success, data: plan } = useLoaderData<LoaderResponse<Plan>>();
    
    return (
        <div className="view-page">
            <DemoBanner />
            {success && <HomeMap plan={plan!} />}
        </div>
    );
};

