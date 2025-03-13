import {useEffect, useState, useMemo, MouseEvent as ReactMouseEvent, useCallback, useRef} from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';

import { Bounds, Collection, Device, DeviceTypes, Plan, PlanDevice, Point } from '@homemap/shared';

import AppLoader from '../../components/AppLoader';
import HomeMap, { MapTransform } from '../../components/HomeMap';
import Toolbar from '../../common/components/Toolbar';
import ApiClient from '../../api';
import { useDispatch } from '../../store/hooks';
import { routes } from '../../app/router';

import DevicesList from './components/DevicesList';
import DeviceProperties from './components/DeviceProperties';
import PlanActions, { PlanActionEvent } from './components/PlanActions';
import PlanSettingsDialog, { DialogValue as PlanSettingsValue } from '../../components/PlanSettingsDialog';
import { getDeviceDefaultIcon } from '../../utils/device';

import actions from './actions';
import { exportPlan, importPlan, toRelativePosition } from './tools';
import { PlanActionsEnum } from './components/PlanActions/constants';
import UnsavedChangesDialog from './components/UnsavedChangesDIalog';

import './style.css';

export type Props = {
    planId: number;
}

const HomeEditor = ({ planId }: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const blocker = useBlocker(({ currentLocation, nextLocation }) =>
        hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Used for reactive UI update
    const [actionsInProgress, setActionsInProgress] = useState<PlanActionsEnum[]>([]);
    // Used to share latest value between callback's calls
    const actionsInProgressRef = useRef<PlanActionsEnum[]>([]);

    const [mapReady, setMapReady] = useState<boolean>(false);
    // Plan state
    const [plan, setPlan] = useState<Plan>();
    const [mapTransform, setMapTransform] = useState<{scale: number, bounds: DOMRect} | undefined>();
    // Devices state
    const [allDevices, setAllDevices] = useState<Collection<Device>>({});
    const [selectedPlanDeviceId, setSelectedPlanDeviceId] = useState<string | undefined>(undefined);
    const [selectedPlanDeviceDrag, setSelectedPlanDeviceDrag] = useState<boolean>(false);
    // Plan settings dialog state
    const [planSettingsOpen, setPlanSettingsOpen] = useState<boolean>(false);
    const [planSettingsValue, setPlanSettingsValue] = useState<PlanSettingsValue>();

    const planDevices = useMemo(() => plan?.devices ?? {}, [plan]);
    const selectedPlanDevice = selectedPlanDeviceId && planDevices[selectedPlanDeviceId];

    const planBounds: Partial<Bounds> = {
        top: 0,
        left: 0,
        right: plan?.width,
        bottom: plan?.height,
    }

    const sensorsData = useMemo<Collection<Device>>(() => {
        return Object.fromEntries(
            Object.entries(allDevices)
                .filter(([id, device]) => device.type === DeviceTypes.Sensor)
        );
    }, [allDevices]);

    useEffect(() => {
        ApiClient
            .getPlan(planId)
            .then((plan) => {
                setPlan(plan);
                setIsLoading(false);
            })
            .catch(() => {
                dispatch.dialog.crash('Не удалось загрузить план');
            });
    }, [planId, dispatch]);

    /**
     * Get all available devices
     */
    useEffect(() => {
        ApiClient
            .getDevices()
            .then(setAllDevices)
            .catch(() => {
                dispatch.dialog.crash('Не удалось загрузить список устройств');
            });
    }, [dispatch]);

    /**
     * Plan action handler
     */
    const handleClickPlanAction = async (e: PlanActionEvent) => {
        actionsInProgressRef.current = [...actionsInProgressRef.current, e.type];
        setActionsInProgress([...actionsInProgressRef.current]);

        switch (e.type) {
            case PlanActionsEnum.Save:
                await handleSave();
                break;
            case PlanActionsEnum.Settings:
                handleShowSettings();
                break;
            case PlanActionsEnum.Export:
                await handleExport();
                break;
            case PlanActionsEnum.Import:
                await handleImport(e.file!);
                break;
            case PlanActionsEnum.ExitToView:
                handleExitToView();
                break;
            case PlanActionsEnum.SyncDevices:
                await handleSyncDevices();
                break;
        }

        const index = actionsInProgressRef.current.findIndex(x => x === e.type);
        actionsInProgressRef.current.splice(index, 1);
        setActionsInProgress([...actionsInProgressRef.current]);
    }

    const handleExitToView = () => {
        navigate(`${routes.view}/${planId}`);
    }

    /**
     * Plan handlers
     */
    const setplanDevices = (updatedDevices: Collection<PlanDevice>) => {
        setPlan({
            ...plan!,
            devices: updatedDevices,
        });
    }

    const handleSave = async () => {
        if (!plan) {
            return;
        }

        try {
            const updatedPlan = await ApiClient.updatePlan(plan.id, plan);
            setPlan(updatedPlan);
            setHasUnsavedChanges(false);
            dispatch.alerts.success('Сохранено');
        } catch {
            dispatch.alerts.error('Ошибка при сохранении');
        }
    }

    const handleSyncDevices = async () => {
        if (!plan) {
            return;
        }

        try {
            // Get device info
            const devices = await ApiClient.getDevices();

            // Copy old plan wihtout devices
            const updatedPlan = { ...plan };
            updatedPlan.devices = {};

            // Fill updated plan devices
            Object.entries(plan.devices).forEach(([id, planDevice]) => {
                const device = devices[id];
                if (!device) {
                    return;
                }

                const updatedDevice: Collection<PlanDevice> = {
                    [id]: {
                        ...planDevice,
                        name: device.name,
                        type: device.type,
                        subtype: device.subtype,
                    }
                }

                Object.assign(updatedPlan.devices, updatedDevice);
            })

            // Update state
            setPlan(updatedPlan);

            dispatch.alerts.success('Устройства синхронизированы. Не забудьте сохранить изменения.');
        } catch {
            dispatch.alerts.error('Ошибка при синхронизации');
        }
    }

    const handleExport = async () => {
        if (!plan) {
            return;
        }

        try {
            await exportPlan(plan);
        } catch {
            dispatch.alerts.error('Ошибка при экспорте');
        }
    }

    const handleImport = async (file: File) => {
        if (!plan) {
            return;
        }

        try {
            const importedPlan = await importPlan(file);
            setPlan(importedPlan);
            dispatch.alerts.success('План загружен. Не забудьте сохранить изменения.');
        } catch (e) {
            dispatch.alerts.error('Ошибка при импорте');
        }
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
        setplanDevices({
            ...planDevices,
            [device.id]: device,
        });
        setHasUnsavedChanges(true);
    }

    const handleDeleteDevice = (deviceId: string) => {
        const updatedplanDevices = {...planDevices}
        delete updatedplanDevices[deviceId];
        setplanDevices(updatedplanDevices);
        setSelectedPlanDeviceId(undefined);
        setHasUnsavedChanges(true);
    }

    const handleAddDevice = (id: string, e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        const device = allDevices[id];
        const icon = getDeviceDefaultIcon(device.type);
        const position = toRelativePosition(
            [e.clientX, e.clientY], 
            {
                top: mapTransform?.bounds.top ?? 0,
                left: mapTransform?.bounds.left ?? 0,
            },
            mapTransform?.scale ?? 1,
        );
        const newDevice = actions.addDevice(device, { icon, position }, planBounds);

        const updatedplanDevices = {
            [id]: newDevice,
            ...planDevices,
        };

        setplanDevices(updatedplanDevices);
        setSelectedPlanDeviceId(id);
        setSelectedPlanDeviceDrag(true);
        setHasUnsavedChanges(true);
    }

    const handleSelectDevice = (id: string) => {
        setSelectedPlanDeviceId(id);
        setSelectedPlanDeviceDrag(false);
    }

    const handleClickDevice = (id: string) => {
        setSelectedPlanDeviceId(id);
        setSelectedPlanDeviceDrag(false);
    }

    /**
     * Drag hanlders
     */
    const handleDragDevice = (id: string, positionDiff: Point) => {
        const device = planDevices[id];
        const updatedDevice = actions.updateDevicePositionByDiff(device, positionDiff, planBounds, true)
        handleChangeDevice(updatedDevice);
    }

    const handleBulbsLinePointDrag = (id: string, index: number, position: Point) => {
        const device = planDevices[id];
        const updatedDevice = actions.updateDeviceBulbsPointByDiff(device, index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }
    
    const handleShadowPointDrag = (id: string, index: number, position: Point) => {
        const device = planDevices[id];
        const updatedDevice = actions.updateDeviceShadowPointByDiff(device, index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }

    const handleShadowMaskPointDrag = (id: string, index: number, position: Point) => {
        const device = planDevices[id];
        const updatedDevice = actions.updateDeviceShadowMaskPointByDiff(device, index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }

    return ( <>
            <AppLoader isLoading={isLoading || !mapReady} />
            {plan && (
                <div className='editor-root'>
                    <Toolbar position="top" withBorder>
                        <PlanActions
                            onClick={handleClickPlanAction}
                            actionsInProgress={actionsInProgress}
                        />
                    </Toolbar>
                    <div className="editor-layout">
                        <Toolbar position="left" >
                            <DevicesList
                                devices={allDevices}
                                devicesOnPlan={planDevices}
                                selectedDeviceId={selectedPlanDeviceId}
                                onDeviceSelected={handleSelectDevice}
                                onDeviceAddClick={handleAddDevice}
                            />
                        </Toolbar>
                        <HomeMap
                            data={sensorsData}
                            background={plan.background}
                            width={plan.width}
                            height={plan.height}
                            elements={planDevices}
                            allowZoom={true}
                            allowDrag={true}
                            allowInitialScale={true}
                            editElementId={selectedPlanDeviceId}
                            editElementDrag={selectedPlanDeviceDrag}
                            isEditorMode={true}
                            onElementClick={handleClickDevice}
                            onElementDrag={handleDragDevice}
                            onBulbsLinePointDrag={handleBulbsLinePointDrag}
                            onShadowPointDrag={handleShadowPointDrag}
                            onShadowMaskPointDrag={handleShadowMaskPointDrag}
                            onTansform={handleTransform}
                            onReady={() => setMapReady(true)}
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
                            {selectedPlanDevice && (
                               <DeviceProperties
                                    device={selectedPlanDevice}
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
                    <UnsavedChangesDialog
                        open={blocker.state === 'blocked'}
                        onSubmit={blocker.proceed!}
                        onClose={blocker.reset!}
                    />
                </div>
            )}
        </>
    )
}

export default HomeEditor;
