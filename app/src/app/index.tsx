import HomeMap from '../components/HomeMap';

import './style.css';
import { useConfiguration } from '../providers/ConfigurationContextProvider';
import { useMapService } from '../hooks/useMapService';

const App = () => {
    const {isLoaded, configuration} = useConfiguration();
    const data = useMapService();

    return (
        <div id="app" className="container">
            {!isLoaded && <div>Loading</div>}
            {configuration && (
                <HomeMap
                    mapSrc={configuration.mapSrc}
                    elements={configuration.elements}
                />
            )}
        </div>
    );
}

export default App;
