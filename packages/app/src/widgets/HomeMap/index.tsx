import { useEffect, useState } from 'react';

import { Plan } from '@homemap/shared';

import { useMapService } from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import ApiClient from '../../api';

export type Props = {
    planId: number;
}

const HomeMapWidget = ({ planId }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [plan, setPlan] = useState<Plan>();
    const [data, switchLight] = useMapService(plan);

    useEffect(() => {
        ApiClient
            .getPlan(planId)
            .then((plan) => {
                setPlan(plan);
                setIsLoading(false);
            });
    }, [planId]);

    const handleElementClick = (id: string) => {
        switchLight(id);
    };

    return (
        <>
            <AppLoader isLoading={isLoading} />
            {plan && (
                <HomeMap
                    background={plan.background}
                    width={plan.width}
                    height={plan.height}
                    elements={plan.devices}
                    data={data}
                    onElementClick={handleElementClick}
                    allowScale={true}
                    allowInitialScale={true}
                    allowRotate={true}
                    allowInitialRotate={true}
                    transition
                />
            )}
        </>
    );
}

export default HomeMapWidget;
