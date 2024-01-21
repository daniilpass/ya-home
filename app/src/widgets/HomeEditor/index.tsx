import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {ElementCollection} from '../../services/configurationService/model/Element';

import {getMagnetPoints} from './tools';

import './style.css';

type DeviceState = HomeDeviceCollection | ElementCollection;

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [allDevices, setAllDevices] = useState<DeviceState>({});
    const [mapDevices, setMapDevices] = useState<ElementCollection>({});
    const [selectedMapDeviceId, setSelectedMapDeviceId] = useState<string | undefined>(undefined);

    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setAllDevices)
            .catch(() => {});
    }, []);

    useEffect(() => {
        setMapDevices(configuration?.elements || {});
    }, [configuration?.elements]);
    
    const handleElementDrag = (id: string, x: number, y: number) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const [magnetX, magnetY] = getMagnetPoints([x, y], [tmpDevice.position.x, tmpDevice.position.y], tmpDevice);
    
        setMapDevices({
            ...mapDevices,
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
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.bulbsLinePoints) {
            return;
        }

        const originPoint = tmpDevice.area.bulbsLinePoints[index];
        const [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);

        const updatedDeviceAreaBulbsLinePoints = [...tmpDevice.area.bulbsLinePoints];
        updatedDeviceAreaBulbsLinePoints[index] = [magnetX || x, magnetY || y];

        
        setMapDevices({
            ...mapDevices,
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
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowPoints) {
            return;
        }

        const originPoint = tmpDevice.area.shadowPoints[index];
        const [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);

        const updatedDeviceAreaShadowPoints = [...tmpDevice.area.shadowPoints];
        updatedDeviceAreaShadowPoints[index] = [magnetX || x, magnetY || y];

        
        setMapDevices({
            ...mapDevices,
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
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowMaskPoints) {
            return;
        }
    
        const originPoint = tmpDevice.area.shadowMaskPoints[index];
        const [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);

        const updatedDeviceAreaShadowMaskPoints = [...tmpDevice.area.shadowMaskPoints];
        updatedDeviceAreaShadowMaskPoints[index] = [magnetX || x, magnetY || y];

        
        setMapDevices({
            ...mapDevices,
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
                                Object.keys(allDevices).map(key => (
                                    <li key={key}>{allDevices[key].name}</li>
                                ))
                            }
                        </ul>
                        <div>На карте</div>
                        <ul>
                            {
                                Object.keys(mapDevices).map(key => (
                                    <li
                                        key={key}
                                        onClick={() => setSelectedMapDeviceId(key)}
                                    >
                                        {mapDevices[key].name}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <HomeMap 
                        imageSrc={configuration.mapSrc}
                        elements={mapDevices}
                        allowRotate={false}
                        allowZoom={true}
                        editElementId={selectedMapDeviceId}
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
