import {useEffect, useState, useMemo, MouseEvent as ReactMouseEvent, useCallback} from 'react';
import { 
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';

import { Collection, Device, PlanDevice } from '@homemap/shared';

import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {useConfiguration} from '../../providers/ConfigurationContextProvider';
import AppLoader from '../../components/AppLoader';
import HomeMap, { MapTransform } from '../../components/HomeMap';
import ApiClient from '../../api';
import { Point } from '../../common/types';
import PointInput from '../../common/components/PointInput';
import PointsList from '../../common/components/PointsList';
import { ELEMENT_RADIUS } from '../../components/HomeMap/constants';

import {getMagnetPoints, getNewPointsForLine, getNewPointsForSquare} from './tools';
import './style.css';

const HomeEditor = () => {
    const {isLoaded, plan} = useConfiguration();
    const [allDevices, setAllDevices] = useState<Collection<Device>>({});
    const [mapDevices, setMapDevices] = useState<Collection<PlanDevice>>({});
    const [selectedMapDeviceId, setSelectedMapDeviceId] = useState<string | undefined>(undefined);
    const [selectedMapDeviceDrag, setSelectedMapDeviceDrag] = useState<boolean>(false);
    const [addDeviceModalOpened, setAddDeviceModalOpened] = useState<boolean>(false);
    const selectedMapDevice = selectedMapDeviceId && mapDevices[selectedMapDeviceId];
    const [mapTransform, setMapTransform] = useState<{scale: number, bounds: DOMRect} | undefined>();

    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setAllDevices)
            .catch(() => {});
    }, []);

    useEffect(() => {
        setMapDevices(plan?.devices || {});
    }, [plan?.devices]);

    const devicesNotOnMap = useMemo<Collection<Device>>(() => {
        return Object.fromEntries(
            Object.entries(allDevices)
                .filter(([id]) => !Object.hasOwn(mapDevices, id))
        );
    }, [allDevices, mapDevices]);

    const limitPosition = ([x, y]: Point): Point => {
        const maxX = plan?.width || Number.POSITIVE_INFINITY;
        const maxY = plan?.height || Number.POSITIVE_INFINITY;

        return [
            Math.min(maxX, Math.max(0, x)),
            Math.min(maxY, Math.max(0, y)),
        ];
    }

    const limitPositions = (points: Point[]): Point[] => points.map(p => limitPosition(p));

    /**
     * Map handlers
     */
    const handleTransform = useCallback(
        ({scale, bounds}: MapTransform) => setMapTransform({scale, bounds}),
        [setMapTransform],
    );

    const toMapRelativePosition = (x: number, y: number): Point => {
        if (!mapTransform) {
            return [x, y];
        }
        return [
            (x - mapTransform.bounds.left) / mapTransform.scale,
            (y - mapTransform.bounds.top) / mapTransform.scale,
        ]
    }

    /**
     * Element hanlders
     */

    const handleElementPositionChange = (id: string, x: number, y: number, isMagnetic: boolean = false) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const [magnetX, magnetY] = isMagnetic
            ? getMagnetPoints([x, y], [tmpDevice.position[0], tmpDevice.position[1]], tmpDevice)
            : [0, 0];
    
        setMapDevices({
            ...mapDevices,
            [id]: {
                ...tmpDevice,
                position: limitPosition([magnetX || x, magnetY || y]),
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

    const handleElementAdd = (id: string, e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        setAddDeviceModalOpened(false);
        if (id === selectedMapDevice) {
            return;
        }
        const newDevice: PlanDevice = {
            ...devicesNotOnMap[id],
            icon: 'bulb',
            position: toMapRelativePosition(e.clientX, e.clientY),
        };

        const updatedMapDevices = {
            [id]: newDevice,
            ...mapDevices,
        };

        setMapDevices(updatedMapDevices);
        setSelectedMapDeviceId(id);
        setSelectedMapDeviceDrag(true);
    }

    const handleElementSelect = (id: string) => {
        setSelectedMapDeviceId(id);
        setSelectedMapDeviceDrag(false);
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
        updatedDeviceAreaBulbsLinePoints[index] = limitPosition([magnetX || x, magnetY || y]);

        
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

    const handleBulbsLinePointAdd = (id: string) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const bulbsPoints = tmpDevice.area?.bulbsLinePoints || [];
        const newPoints = limitPositions(getNewPointsForLine(bulbsPoints, tmpDevice.position, ELEMENT_RADIUS * 3));
        const updatedDeviceAreaBulbsLinePoints = [...bulbsPoints, ...newPoints]

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
        updatedDeviceAreaShadowPoints[index] = limitPosition([magnetX || x, magnetY || y]);

        
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

    const handleShadowPointAdd = (id: string) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const shadowPoints = tmpDevice.area?.shadowPoints || [];
        const newPoints = limitPositions(getNewPointsForSquare(shadowPoints, tmpDevice.position, ELEMENT_RADIUS * 4));
        const updatedDeviceAreaShadowPoints = [...shadowPoints, ...newPoints];
        
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
        updatedDeviceAreaShadowMaskPoints[index] = limitPosition([magnetX || x, magnetY || y]);

        
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

    const handleShadowMaskPointAdd = (id: string) => {
        const tmpDevice = mapDevices[id];
        if (!tmpDevice) {
            return;
        }

        const shadowMaskPoints = tmpDevice.area?.shadowMaskPoints || [];
        const newPoints = limitPositions(getNewPointsForSquare(shadowMaskPoints, tmpDevice.position, ELEMENT_RADIUS * 3));
        const updatedDeviceAreaShadowMaskPoints = [...shadowMaskPoints, ...newPoints];

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
            {plan && (
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
                                            onClick={() => handleElementSelect(key)}
                                            
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
                                                onClick={(e) => handleElementAdd(key, e)}
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
                        background={plan.background}
                        width={plan.width}
                        height={plan.height}
                        elements={mapDevices}
                        allowZoom={true}
                        allowDrag={true}
                        allowScale={false}
                        allowRotate={false}
                        allowInitialRotate={false}
                        editElementId={selectedMapDeviceId}
                        editElementDrag={selectedMapDeviceDrag}
                        isEditorMode={true}
                        onElementDrag={handleElementDrag}
                        onBulbsLinePointDrag={handleBulbsLinePointDrag}
                        onShadowPointDrag={handleShadowPointDrag}
                        onShadowMaskPointDrag={handleShadowMaskPointDrag}
                        onTansform={handleTransform}
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
                                        value={selectedMapDevice.position}
                                        onChange={(value) => handleElementPositionChange(selectedMapDevice.id, ...value)}
                                    />
                                </Box>

                                <Divider variant="middle" textAlign="left">Линия ламп</Divider>

                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.bulbsLinePoints || []}
                                        onChange={(index, value) => handleBulbsLinePointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={() => handleBulbsLinePointAdd(selectedMapDevice.id)}
                                        onDelete={(index) => handleBulbsLinePointDelete(selectedMapDevice.id, index)}
                                    />
                                </Box>
                                
                                <Divider variant="middle" textAlign="left">Тень</Divider>

                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.shadowPoints || []}
                                        onChange={(index, value) => handleShadowPointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={() => handleShadowPointAdd(selectedMapDevice.id)}
                                        onDelete={(index) => handleShadowPointDelete(selectedMapDevice.id, index)}
                                    />
                                </Box>
                                
                                <Divider variant="middle" textAlign="left">Маска тени</Divider>
                                
                                <Box sx={{p: 2}}>
                                    <PointsList
                                        value={selectedMapDevice.area?.shadowMaskPoints || []}
                                        onChange={(index, value) => handleShadowMaskPointChange(selectedMapDevice.id, index, ...value)}
                                        onAdd={() => handleShadowMaskPointAdd(selectedMapDevice.id)}
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