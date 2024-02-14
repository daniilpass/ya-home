import {useEffect, useState, useMemo, MouseEvent as ReactMouseEvent, useCallback} from 'react';

import { Bounds, Collection, Device, Plan, PlanDevice } from '@homemap/shared';

import AppLoader from '../../components/AppLoader';
import HomeMap, { MapTransform } from '../../components/HomeMap';
import Toolbar from '../../common/components/Toolbar';
import { DeviceIconName } from '../../components/DeviceIcon';
import ApiClient from '../../api';

import DevicesList from './components/DevicesList';
import DeviceProperties from './components/DeviceProperties';
import PlanActions from './components/PlanActions';
import PlanSettingsDialog, { DialogValue as PlanSettingsValue } from '../../components/PlanSettingsDialog';
import actions from './actions';
import { toRelativePosition } from './tools';

import './style.css';

export type Props = {
    planId: number;
}

const HomeEditor = ({ planId }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Plan state
    const [plan, setPlan] = useState<Plan>();
    const [mapTransform, setMapTransform] = useState<{scale: number, bounds: DOMRect} | undefined>();
    // Devices state
    const [allDevices, setAllDevices] = useState<Collection<Device>>({});
    const [selectedMapDeviceId, setSelectedMapDeviceId] = useState<string | undefined>(undefined);
    const [selectedMapDeviceDrag, setSelectedMapDeviceDrag] = useState<boolean>(false);
    // Plan settings dialog state
    const [planSettingsOpen, setPlanSettingsOpen] = useState<boolean>(false);
    const [planSettingsValue, setPlanSettingsValue] = useState<PlanSettingsValue>();

    const mapDevices = useMemo(() => plan?.devices ?? {}, [plan]);
    const selectedMapDevice = selectedMapDeviceId && mapDevices[selectedMapDeviceId];
    const planBounds: Partial<Bounds> = {
        top: 0,
        left: 0,
        right: plan?.width,
        bottom: plan?.height,
    }

    useEffect(() => {
        ApiClient
            .getPlan(planId)
            .then((plan) => {
                setPlan(plan);
                setIsLoading(false);
            });
    }, [planId]);

    /**
     * Get all available devices
     */
    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setAllDevices)
            .catch(() => {});
    }, []);

    /**
     * Filtered devices no on plan
     */
    const devicesNotOnMap = useMemo<Collection<Device>>(() => {
        return Object.fromEntries(
            Object.entries(allDevices)
                .filter(([id]) => !Object.hasOwn(mapDevices, id))
        );
    }, [allDevices, mapDevices]);

    /**
     * Plan handlers
     */
    const setMapDevices = (updatedDevices: Collection<PlanDevice>) => {
        setPlan({
            ...plan!,
            devices: updatedDevices,
        });
    }

    const handleSave = async () => {
        if (!plan) {
            return;
        }

        const updatedPlan = await ApiClient.updatePlan(plan.id, plan);
        setPlan(updatedPlan);
    }

    /**
     * Plan settings dialog
     */
    const handleShowSettings = () => {
        setPlanSettingsValue(plan);
        setPlanSettingsOpen(true);
    }

    const handleCloseSettings = async () => {
        setPlanSettingsOpen(false);
    }

    const handleChangePlanSettings = async (value: PlanSettingsValue) => {
        const updatedPlan = {
            ...plan!,
            width: value.width,
            height: value.height,
            background: {
                ...value.background,
            }
        };
        setPlanSettingsOpen(false);
        setPlan(updatedPlan);
    }

    /**
     * Map handlers
     */
    const handleTransform = useCallback(
        ({scale, bounds}: MapTransform) => setMapTransform({scale, bounds}),
        [setMapTransform],
    );

    /**
     * Device hanlders
     */
    
    const handleChangeDevice = (device: PlanDevice) => {
        setMapDevices({
            ...mapDevices,
            [device.id]: device,
        });
    }

    const handleDeleteDevice = (deviceId: string) => {
        const updatedMapDevices = {...mapDevices}
        delete updatedMapDevices[deviceId];
        setMapDevices(updatedMapDevices);
        setSelectedMapDeviceId(undefined);
    }

    const handleAddDevice = (id: string, e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        const icon: DeviceIconName = 'bulb';
        const position = toRelativePosition(
            [e.clientX, e.clientY], 
            {
                top: mapTransform?.bounds.top ?? 0,
                left: mapTransform?.bounds.left ?? 0,
            },
            mapTransform?.scale ?? 1,
        );
        const newDevice = actions.addDevice(devicesNotOnMap[id], { icon, position }, planBounds);

        const updatedMapDevices = {
            [id]: newDevice,
            ...mapDevices,
        };

        setMapDevices(updatedMapDevices);
        setSelectedMapDeviceId(id);
        setSelectedMapDeviceDrag(true);
    }

    const handleSelectDevice = (id: string) => {
        setSelectedMapDeviceId(id);
        setSelectedMapDeviceDrag(false);
    }

    /**
     * Drag hanlders
     */
    const handleDragDevice = (id: string, x: number, y: number) => {
        const device = mapDevices[id];
        const updatedDevice = actions.updateDevicePosition(device, [x, y], planBounds, true)
        handleChangeDevice(updatedDevice);
    }

    const handleBulbsLinePointDrag = (id: string, index: number, x: number, y: number) => {
        const device = mapDevices[id];
        const updatedDevice = actions.updateDeviceBulbsPoint(device, index, [x, y], planBounds, true);
        handleChangeDevice(updatedDevice);
    }
    
    const handleShadowPointDrag = (id: string, index: number, x: number, y: number) => {
        const device = mapDevices[id];
        const updatedDevice = actions.updateDeviceShadowPoint(device, index, [x, y], planBounds, true);
        handleChangeDevice(updatedDevice);
    }

    const handleShadowMaskPointDrag = (id: string, index: number, x: number, y: number) => {
        const device = mapDevices[id];
        const updatedDevice = actions.updateDeviceShadowMaskPoint(device, index, [x, y], planBounds, true);
        handleChangeDevice(updatedDevice);
    }

    return ( <>
            <AppLoader isLoading={isLoading} />
            {plan && (
                <div className='editor-root'>
                    <Toolbar position="top" withBorder>
                        <PlanActions
                            onSave={handleSave}
                            onShowSettings={handleShowSettings}
                        />
                    </Toolbar>
                    <div className="editor-layout">
                        <Toolbar position="left" >
                            <DevicesList
                                devices={allDevices}
                                devicesOnPlan={mapDevices}
                                selectedDeviceId={selectedMapDeviceId}
                                onDeviceSelected={handleSelectDevice}
                                onDeviceAddClick={handleAddDevice}
                            />
                        </Toolbar>
                        <HomeMap 
                            background={plan.background}
                            width={plan.width}
                            height={plan.height}
                            elements={mapDevices}
                            allowZoom={true}
                            allowDrag={true}
                            allowInitialScale={true}
                            editElementId={selectedMapDeviceId}
                            editElementDrag={selectedMapDeviceDrag}
                            isEditorMode={true}
                            onElementDrag={handleDragDevice}
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
                        <Toolbar position="right" >
                            {selectedMapDevice && (
                               <DeviceProperties
                                    device={selectedMapDevice}
                                    bounds={planBounds}
                                    onChange={handleChangeDevice}
                                    onDelete={handleDeleteDevice}
                                />
                            )}
                        </Toolbar>
                    </div>
                    <PlanSettingsDialog
                        open={planSettingsOpen}
                        onClose={handleCloseSettings}
                        value={planSettingsValue!}
                        onSubmit={handleChangePlanSettings}
                    />
                </div>
            )}
        </>
    )
}

export default HomeEditor;
