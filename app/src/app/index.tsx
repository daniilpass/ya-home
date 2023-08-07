import {useConfiguration} from '../providers/ConfigurationContextProvider';
import {useMapService} from '../hooks/useMapService';
import AppLoader from '../components/AppLoader';
import HomeMap from '../components/HomeMap';

import './style.css';

const App = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [data, switchLight] = useMapService();

    const handleElementClick = (id: string) => {
        switchLight(id);
    };

    return (
        <div id="app" className="container">
            <AppLoader isLoading={!isLoaded} />
            {configuration && (
                <HomeMap
                    imageSrc={configuration.mapSrc}
                    elements={configuration.elements}
                    data={data}
                    onElementClick={handleElementClick}
                />
            )}
        </div>
    );
}

export default App;
