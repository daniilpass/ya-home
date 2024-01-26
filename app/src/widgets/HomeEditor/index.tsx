import {useEffect, useState, useMemo} from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap from '../../components/HomeMap';
import {HomeDeviceCollection} from '../../api/model/HomeDevice';
import ApiClient from '../../api';
import {Element, ElementCollection} from '../../services/configurationService/model/Element';
import { Point } from '../../common/types';
import PointInput from '../../common/components/PointInput';
import PointsList from '../../common/components/PointsList';

import {getMagnetPoints} from './tools';
import './style.css';

const HomeEditor = () => {
    const {isLoaded, configuration} = useConfiguration();
    const [allDevices, setAllDevices] = useState<HomeDeviceCollection>({});
    const [mapDevices, setMapDevices] = useState<ElementCollection>({});
    const [selectedMapDeviceId, setSelectedMapDeviceId] = useState<string | undefined>(undefined);
    const [addDeviceModalOpened, setAddDeviceModalOpened] = useState<boolean>(false);
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

    const devicesNotOnMap = useMemo<HomeDeviceCollection>(() => {
        return Object.fromEntries(
            Object.entries(allDevices)
                .filter(([id]) => !Object.hasOwn(mapDevices, id))
        );
    }, [allDevices, mapDevices]);

    /**
     * Element hanlders
     */

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
    
    const handleElementDrag = (id: string, x: number, y: number) => {
        handleElementPositionChange(id, x, y, true);
    }

    const handleElementDelete = (id: string) => {
        const updatedMapDevices = {...mapDevices}
        delete updatedMapDevices[id];
        setMapDevices(updatedMapDevices);
        setSelectedMapDeviceId(undefined);
    }

    const handleElementAdd = (id: string) => {
        setAddDeviceModalOpened(false);
        if (id === selectedMapDevice) {
            console.log('HELLO LOG')
            return;
        }
        const newDevice: Element = {
            ...devicesNotOnMap[id],
            position: {x: 50, y: 50},
        };

        const updatedMapDevices = {
            [id]: newDevice,
            ...mapDevices,
        };

        setMapDevices(updatedMapDevices);
        setSelectedMapDeviceId(id);
    }

    /**
     * Bulbs hanlders
     */

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

    const handleBulbsLinePointDrag = (id: string, index: number, x: number, y: number) => {
        handleBulbsLinePointChange(id, index, x, y, true);
    }

    const handleBulbsLinePointDelete = (id: string, index: number) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.bulbsLinePoints) {
            return;
        }

        const updatedDeviceAreaBulbsLinePoints = [...tmpDevice.area.bulbsLinePoints]
        updatedDeviceAreaBulbsLinePoints.splice(index, 1);

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

    const handleBulbsLinePointAdd = (id: string, value: Point) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const updatedDeviceAreaBulbsLinePoints = [...(tmpDevice.area?.bulbsLinePoints || []), value]

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

    /**
     * Shadow hanlders
     */

    const handleShadowPointChange = (id: string, index: number, x: number, y: number, isMagnetic: boolean = false) => {
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

    const handleShadowPointDrag = (id: string, index: number, x: number, y: number) => {
        handleShadowPointChange(id, index, x, y, true);
    }

    const handleShadowPointDelete = (id: string, index: number) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowPoints) {
            return;
        }

        const updatedDeviceAreaShadowPoints = [...tmpDevice.area.shadowPoints];
        updatedDeviceAreaShadowPoints.splice(index, 1);

        
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

    const handleShadowPointAdd = (id: string, value: Point) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const updatedDeviceAreaShadowPoints = [...(tmpDevice.area?.shadowPoints || []), value];
        
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

    /**
     * ShadowMask hanlders
     */

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

    const handleShadowMaskPointDrag = (id: string, index: number, x: number, y: number) => {
        handleShadowMaskPointChange(id, index, x, y, true)
    }
    
    const handleShadowMaskPointDelete = (id: string, index: number) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice.area?.shadowMaskPoints) {
            return;
        }

        const updatedDeviceAreaShadowMaskPoints = [...tmpDevice.area.shadowMaskPoints];
        updatedDeviceAreaShadowMaskPoints.splice(index, 1);

        
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

    const handleShadowMaskPointAdd = (id: string, value: Point) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const updatedDeviceAreaShadowMaskPoints = [...(tmpDevice.area?.shadowMaskPoints || []), value];

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
                    <div className="editor-panel editor-panel--left">
                        <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                            <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                                Устройства
                            </Typography>
                            <Button startIcon={<AddIcon />} onClick={() => setAddDeviceModalOpened(true)}>
                                Добавить
                            </Button>
                        </Box>
                        <Box sx={{p: "0 8px"}}>
                            <List component="div" sx={{m: "0 -8px", p: 0}}>
                                {
                                    Object.keys(mapDevices).map(key => (
                                        <ListItemButton
                                            key={key}
                                            selected={key === selectedMapDeviceId}
                                            onClick={() => setSelectedMapDeviceId(key)}
                                            
                                        >
                                            <ListItemText primary={mapDevices[key].name} />
                                        </ListItemButton>
                                    ))
                                }
                            </List>
                        </Box>
                        <Dialog
                            open={addDeviceModalOpened}
                            onClose={() => setAddDeviceModalOpened(false)}
                        >
                            <DialogTitle>Устройства</DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => setAddDeviceModalOpened(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent dividers={true}>
                                <List component="div" sx={{padding: 0, width: 400 }}>
                                    {
                                        Object.keys(devicesNotOnMap).map(key => (
                                            <ListItemButton
                                                key={key}
                                                onClick={() => handleElementAdd(key)}
                                            >
                                                <ListItemText primary={devicesNotOnMap[key].name} />
                                            </ListItemButton>
                                        ))
                                    }
                                </List>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <HomeMap 
                        plan={configuration.plan}
                        elements={mapDevices}
                        allowZoom={true}
                        allowDrag={true}
                        allowScale={false}
                        allowRotate={false}
                        allowInitialRotate={false}
                        editElementId={selectedMapDeviceId}
                        isEditorMode={true}
                        onElementDrag={handleElementDrag}
                        onBulbsLinePointDrag={handleBulbsLinePointDrag}
                        onShadowPointDrag={handleShadowPointDrag}
                        onShadowMaskPointDrag={handleShadowMaskPointDrag}
                        classes={{
                            wrapper: 'editor_map-wrapper',
                            layout: 'editor_map-layout',
                        }}
                        styles={{
                            wrapper: {
                                backgroundColor: undefined,
                            }
                        }}
                    />
                    <div className="editor-panel  editor-panel--right">
                        {selectedMapDevice && (
                            <>
                                <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                    <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                                        {mapDevices[selectedMapDevice.id].name}
                                    </Typography>
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleElementDelete(selectedMapDevice.id)}
                                    >
                                        Удалить
                                    </Button> 
                                </Box>
                                                               
                                <Divider variant="middle" textAlign="left">Позиция</Divider>

                                <Box sx={{p: 2}}>
                                    <PointInput
                                        value={[selectedMapDevice.position.x, selectedMapDevice.position.y]}
                                        onChange={(value) => handleElementPositionChange(selectedMapDevice.id, ...value)}
                                    />
                                </Box>

                                <Divider variant="middle" textAlign="left">Линия ламп</Divider>

                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.bulbsLinePoints || []}
                                        onChange={(index, value) => handleBulbsLinePointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={(value) => handleBulbsLinePointAdd(selectedMapDevice.id, value)}
                                        onDelete={(index) => handleBulbsLinePointDelete(selectedMapDevice.id, index)}
                                    />
                                </Box>
                                
                                <Divider variant="middle" textAlign="left">Тень</Divider>

                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.shadowPoints || []}
                                        onChange={(index, value) => handleShadowPointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={(value) => handleShadowPointAdd(selectedMapDevice.id, value)}
                                        onDelete={(index) => handleShadowPointDelete(selectedMapDevice.id, index)}
                                    />
                                </Box>
                                
                                <Divider variant="middle" textAlign="left">Маска тени</Divider>
                                
                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.shadowMaskPoints || []}
                                        onChange={(index, value) => handleShadowMaskPointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={(value) => handleShadowMaskPointAdd(selectedMapDevice.id, value)}
                                        onDelete={(index) => handleShadowMaskPointDelete(selectedMapDevice.id, index)}
                                    />
                                </Box>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default HomeEditor;
