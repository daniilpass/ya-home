import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';
import {ELEMENT_RADIUS} from '../../components/HomeMap/constants';

import {getMagnetPoints} from './tools';
import './style.css';

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [devices, setDevices] = useState<HomeDeviceCollection>({});
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const [mapDevicesEdited, setMapDevicesEdited] = useState<Record<string, ConfigurationElement> | undefined>(undefined);

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
        const tmp = mapDevicesEdited || mapDevices;
        const tmpDevice = tmp[id];
        
        setMapDevicesEdited({
            ...tmp,
            [id]: {
                ...tmpDevice,
                position: {x, y}
            }
        })
    }

    const handleBulbsLinePointDrag = (id: string, index: number, x: number, y: number) => {
        const tmp = mapDevicesEdited || mapDevices;
        const tmpDevice = tmp[id];
        if (!tmpDevice.area?.bulbsLinePoints) {
            return;
        }
        
        let [magnetX, magnetY]: Array<number | undefined> = [];

        // Magnet to element
        [magnetX, magnetY] = getMagnetPoints(x, y, tmpDevice.position.x, tmpDevice.position.y, ELEMENT_RADIUS / 2);

        // Magnet to bulbs line
        for (let pointIndex = 0; pointIndex < tmpDevice.area.bulbsLinePoints.length; pointIndex++) {
            const [pointX, pointY] = tmpDevice.area.bulbsLinePoints[pointIndex];
            if (pointIndex === index) {
                continue;
            }
            let [magnetXToBulb, magnetYToBulb] = getMagnetPoints(x, y, pointX, pointY, 10);
            magnetX = magnetX || magnetXToBulb;
            magnetY = magnetY || magnetYToBulb;
            if (magnetX && magnetY) {
                break;
            }
        }
    
        const updatedDeviceAreaBulbsLinePoints = [...tmpDevice.area.bulbsLinePoints];
        updatedDeviceAreaBulbsLinePoints[index] = [magnetX || x, magnetY || y];

        setMapDevicesEdited({
            ...tmp,
            [id]: {
                ...tmpDevice,
                area: {
                    ...tmpDevice.area,
                    bulbsLinePoints: updatedDeviceAreaBulbsLinePoints,
                }
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
                        elements={mapDevicesEdited || mapDevices}
                        allowRotate={false}
                        editElementId={selectedDeviceId}
                        isEditorMode={true}
                        onElementDrag={handleElementDrag}
                        onBulbsLinePointDrag={handleBulbsLinePointDrag}
                    />
                    <div className="editor-panel  editor-panel--right"></div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
