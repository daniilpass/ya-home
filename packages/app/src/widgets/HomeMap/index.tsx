import { useState } from 'react';

import type { Plan } from '@homemap/shared';

import { useMapService } from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';

import FabEdit from './components/FabEdit';

export type Props = {
    plan: Plan;
}

const HomeMapWidget = ({ plan }: Props) => {
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [data, actionSwitch] = useMapService(plan);

    const handleElementClick = (id: string) => {
        actionSwitch(id);
    };

    return (
        <>
            <AppLoader isLoading={!mapReady} />
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
    );
};

export default HomeMapWidget;
