import {useEffect, useState} from 'react';
import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {ElementCollection} from '../../services/configurationService/model/Element';

import PointInput from '../../common/components/PointInput';
import PointsList from '../../common/components/PointsList';

import {getMagnetPoints} from './tools';
import './style.css';

type DeviceState = HomeDeviceCollection | ElementCollection;

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [allDevices, setAllDevices] = useState<DeviceState>({});
    const [mapDevices, setMapDevices] = useState<ElementCollection>({});
    const [selectedMapDeviceId, setSelectedMapDeviceId] = useState<string | undefined>(undefined);
    const selectedMapDevice = selectedMapDeviceId && mapDevices[selectedMapDeviceId];

    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setAllDevices)
            .catch(() => {});
    }, []);

    useEffect(() => {
        setMapDevices(configuration?.elements || {});
    }, [configuration?.elements]);

    const handleElementPositionChange = (id: string, x: number, y: number, isMagnetic: boolean = false) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const [magnetX, magnetY] = isMagnetic
            ? getMagnetPoints([x, y], [tmpDevice.position.x, tmpDevice.position.y], tmpDevice)
            : [0, 0];
    
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

    const handleBulbsLinePointChange = (id: string, index: number, x: number, y: number, isMagnetic: boolean = false) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.bulbsLinePoints) {
            return;
        }

        let [magnetX, magnetY] = new Array<number | undefined>(2);
        if (isMagnetic) {
            const originPoint = tmpDevice.area.bulbsLinePoints[index];
            [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);
        }

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

    const handleShadowPointChange= (id: string, index: number, x: number, y: number, isMagnetic: boolean = false) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowPoints) {
            return;
        }

        let [magnetX, magnetY] = new Array<number | undefined>(2);
        if (isMagnetic) {
            const originPoint = tmpDevice.area.shadowPoints[index];
            [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);
        }

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

    const handleShadowMaskPointChange = (id: string, index: number, x: number, y: number, isMagnetic: boolean = false) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowMaskPoints) {
            return;
        }
    
        let [magnetX, magnetY] = new Array<number | undefined>(2);
        if (isMagnetic) {
            const originPoint = tmpDevice.area.shadowMaskPoints[index];
            [magnetX, magnetY] = getMagnetPoints([x, y], originPoint, tmpDevice);
        }

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

    const handleElementDrag = (id: string, x: number, y: number) => {
        handleElementPositionChange(id, x, y, true);
    }

    const handleBulbsLinePointDrag = (id: string, index: number, x: number, y: number) => {
        handleBulbsLinePointChange(id, index, x, y, true);
    }

    const handleShadowPointDrag = (id: string, index: number, x: number, y: number) => {
        handleShadowPointChange(id, index, x, y, true);
    }

    const handleShadowMaskPointDrag = (id: string, index: number, x: number, y: number) => {
        handleShadowMaskPointChange(id, index, x, y, true)
    }

    return ( <>
            <AppLoader isLoading={!isLoaded} />
            {configuration && (
                <div className="editor-layout">
                    <div className="editor-panel editor-panel--left editor-panel--split-2">
                        <h3>Все устройства</h3>
                        <ul>
                            {
                                Object.keys(allDevices).map(key => (
                                    <li key={key}>{allDevices[key].name}</li>
                                ))
                            }
                        </ul>
                        <h3>На карте</h3>
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
                    <div className="editor-panel  editor-panel--right">
                        {selectedMapDevice && (
                            <>
                                <h3>Позиция</h3>
                                <PointInput
                                    value={[selectedMapDevice.position.x, selectedMapDevice.position.y]}
                                    onChange={(value) => handleElementPositionChange(selectedMapDevice.id, ...value)}
                                />

                                <h3>Линия ламп</h3>
                                <PointsList
                                    value={selectedMapDevice.area?.bulbsLinePoints || []}
                                    onChange={(index, value) => handleBulbsLinePointChange(selectedMapDevice.id, index, ...value)}
                                />

                                <h3>Зона тени</h3>
                                <PointsList
                                    value={selectedMapDevice.area?.shadowPoints || []}
                                    onChange={(index, value) => handleShadowPointChange(selectedMapDevice.id, index, ...value)}
                                />

                                <h3>Зона маски тени</h3>
                                <PointsList
                                    value={selectedMapDevice.area?.shadowMaskPoints || []}
                                    onChange={(index, value) => handleShadowMaskPointChange(selectedMapDevice.id, index, ...value)}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
