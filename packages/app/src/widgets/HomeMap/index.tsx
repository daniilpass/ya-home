import { useEffect, useState } from 'react';

import type { Plan } from '@homemap/shared';

import { useMapService } from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import ApiClient from '../../api';
import { useDispatch } from '../../store/hooks';
import FabEdit from './components/FabEdit';

export type Props = {
    planId: number;
}

const HomeMapWidget = ({ planId }: Props) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [plan, setPlan] = useState<Plan>();
    const [data, actionSwitch] = useMapService(plan);

    useEffect(() => {
        ApiClient
            .getPlan(planId)
            .then((plan) => {
                setPlan(plan);
                setIsLoading(false);
            })
            .catch(() => {
                dispatch.dialog.crash('Не удалось загрузить план');
            });
    }, [planId, dispatch]);

    const handleElementClick = (id: string) => {
        actionSwitch(id);
    };

    return (
        <>
            <AppLoader isLoading={isLoading || !mapReady} />
            {plan && (
                <>
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
                        // transition
                        onReady={() => setMapReady(true)}
                    />
                    <FabEdit planId={plan.id} />
                </>
            )}
        </>
    );
};

export default HomeMapWidget;
