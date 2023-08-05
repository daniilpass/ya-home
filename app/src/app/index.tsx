import React, {useEffect, useState} from 'react';

import HomeMap from '../components/HomeMap';
import {Configuration, loadConfiguration} from '../tools/loadConfiguration';

import './style.css';

function App() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);

  useEffect(() => {
    loadConfiguration().then(cfg => {
      setConfiguration(cfg);
      setIsLoaded(true);
    });
  }, []);

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
