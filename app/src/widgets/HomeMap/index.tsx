import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import {useMapService} from '../../hooks/useMapService';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';

const HomeMapW = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [data, switchLight] = useMapService();

    const handleElementClick = (id: string) => {
        switchLight(id);
    };

    return (
        <>
            <AppLoader isLoading={!isLoaded} />
            {configuration && (
                <HomeMap
                    plan={configuration.plan}
                    elements={configuration.elements}
                    data={data}
                    onElementClick={handleElementClick}
                />
            )}
        </>
    );
}

export default HomeMapW;
