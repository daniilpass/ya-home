import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import {useMapService} from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';

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
                    background={plan.background}
                    width={plan.width}
                    height={plan.height}
                    elements={plan.devices}
                    data={data}
                    onElementClick={handleElementClick}
                />
            )}
        </>
    );
}

export default HomeMapW;
