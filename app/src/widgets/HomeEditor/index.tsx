import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';

import {getMagnetPointsForAnchors} from './tools';

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
        
        const [magnetX, magnetY] = getMagnetPointsForAnchors(
            [x, y],
            null,
            tmpDevice.area?.bulbsLinePoints || []
        )
    
        setMapDevicesEdited({
            ...tmp,
            [id]: {
                ...tmpDevice,
                position: {
                    x: magnetX || x, 
                    y: magnetY || y,
                }
            }
        })
    }

    const handleBulbsLinePointDrag = (id: string, index: number, x: number, y: number) => {
        const tmp = mapDevicesEdited || mapDevices;
        const tmpDevice = tmp[id];
        if (!tmpDevice.area?.bulbsLinePoints) {
            return;
        }
        const originPoint = tmpDevice.area.bulbsLinePoints[index];

        const [magnetX, magnetY] = getMagnetPointsForAnchors(
            [x, y],
            originPoint,
            tmpDevice.area.bulbsLinePoints,
            [[tmpDevice.position.x, tmpDevice.position.y]]
        )

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

    const handleShadowPointDrag = (id: string, index: number, x: number, y: number) => {
        const tmp = mapDevicesEdited || mapDevices;
        const tmpDevice = tmp[id];
        if (!tmpDevice.area?.shadowPoints) {
            return;
        }
        const originPoint = tmpDevice.area.shadowPoints[index];

        const [magnetX, magnetY] = getMagnetPointsForAnchors(
            [x, y],
            originPoint,
            tmpDevice.area.shadowPoints,
            tmpDevice.area.bulbsLinePoints || [],
            [[tmpDevice.position.x, tmpDevice.position.y]]
        )

        const updatedDeviceAreaShadowPoints = [...tmpDevice.area.shadowPoints];
        updatedDeviceAreaShadowPoints[index] = [magnetX || x, magnetY || y];

        
        setMapDevicesEdited({
            ...tmp,
            [id]: {
                ...tmpDevice,
                area: {
                    ...tmpDevice.area,
                    shadowPoints: updatedDeviceAreaShadowPoints,
                }
            }
        })
    }

    const handleShadowMaskPointDrag = (id: string, index: number, x: number, y: number) => {
        const tmp = mapDevicesEdited || mapDevices;
        const tmpDevice = tmp[id];
        if (!tmpDevice.area?.shadowMaskPoints) {
            return;
        }
        const originPoint = tmpDevice.area.shadowMaskPoints[index];

        const [magnetX, magnetY] = getMagnetPointsForAnchors(
            [x, y],
            originPoint,
            tmpDevice.area.shadowMaskPoints,
            tmpDevice.area.bulbsLinePoints || [],
            [[tmpDevice.position.x, tmpDevice.position.y]]
        )

        const updatedDeviceAreaShadowMaskPoints = [...tmpDevice.area.shadowMaskPoints];
        updatedDeviceAreaShadowMaskPoints[index] = [magnetX || x, magnetY || y];

        
        setMapDevicesEdited({
            ...tmp,
            [id]: {
                ...tmpDevice,
                area: {
                    ...tmpDevice.area,
                    shadowMaskPoints: updatedDeviceAreaShadowMaskPoints,
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
                        allowZoom={true}
                        editElementId={selectedDeviceId}
                        isEditorMode={true}
                        onElementDrag={handleElementDrag}
                        onBulbsLinePointDrag={handleBulbsLinePointDrag}
                        onShadowPointDrag={handleShadowPointDrag}
                        onShadowMaskPointDrag={handleShadowMaskPointDrag}
                    />
                    <div className="editor-panel  editor-panel--right"></div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
