import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';

import './style.css';


const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();

    return ( <>
            <AppLoader isLoading={!isLoaded} />
            {configuration && (
                <div className="editor-layout">
                    <div className="editor-panel editor-panel--left"></div>
                    <HomeMap 
                        imageSrc={configuration.mapSrc}
                        elements={configuration.elements}
                        allowRotate={false}
                    />
                    <div className="editor-panel  editor-panel--right"></div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
