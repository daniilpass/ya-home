import HomeMap from '../components/HomeMap';

import './style.css';
import { useConfiguration } from '../providers/ConfigurationContextProvider';

const App = () => {
    const {
        isLoaded,
        configuration,
    } = useConfiguration();

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
