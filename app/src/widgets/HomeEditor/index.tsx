import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';

import './style.css';

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [data, setData] = useState<HomeDeviceCollection>();

    useEffect(() => {
        ApiClient.getDevices().then(setData);
    }, []);

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
