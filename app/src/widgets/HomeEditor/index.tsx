import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';

import './style.css';

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [devices, setDevices] = useState<HomeDeviceCollection>({});
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const [updatedMapDevices, setUpdatedMapDevices] = useState<Record<string, ConfigurationElement> | undefined>(undefined);

    const {
        mapSrc = '',
        elements: mapDevices = {},
    } = configuration || {};

    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setDevices)
            .catch(() => {});
    }, []);

    const handleElementDrag = (id: string, x: number, y: number) => {
        const tmp = updatedMapDevices || mapDevices;
        const tmpDevice = tmp[id];
        
        setUpdatedMapDevices({
            ...tmp,
            [id]: {
                ...tmpDevice,
                position: {x, y}
            }
        })
    }

    return ( <>
            <AppLoader isLoading={!isLoaded} />
            {configuration && (
                <div className="editor-layout">
                    <div className="editor-panel editor-panel--left editor-panel--split-2">
                        <div>Все устройства</div>
                        <ul>
                            {
                                Object.keys(devices).map(key => (
                                    <li key={key}>{devices[key].name}</li>
                                ))
                            }
                        </ul>
                        <div>На карте</div>
                        <ul>
                            {
                                Object.keys(mapDevices).map(key => (
                                    <li
                                        key={key}
                                        onClick={() => setSelectedDeviceId(key)}
                                    >
                                        {mapDevices[key].name}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <HomeMap 
                        imageSrc={mapSrc}
                        elements={updatedMapDevices || mapDevices}
                        allowRotate={false}
                        editElementId={selectedDeviceId}
                        isEditorMode={true}
                        onElementDrag={handleElementDrag}
                    />
                    <div className="editor-panel  editor-panel--right"></div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
