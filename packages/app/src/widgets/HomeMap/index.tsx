import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import {useMapService} from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import { uuidOrDataToURL } from '../../utils/mediaStorage';

const HomeMapW = () => {
    const {isLoaded, plan} = useConfiguration();
    const [data, switchLight] = useMapService();

    const handleElementClick = (id: string) => {
        switchLight(id);
    };

    return (
        <>
            <AppLoader isLoading={!isLoaded} />
            {plan && (
                <HomeMap
                    background={{
                        color: plan.background.color,
                        image: uuidOrDataToURL(plan.background.image),
                    }}
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

export default HomeMapW;
