import type { MouseEvent as ReactMouseEvent} from 'react';
import {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { Box } from '@mui/material';

import type { Bounds, Collection, Device, Plan, PlanDevice, Point } from '@homemap/shared';
import { DeviceTypes } from '@homemap/shared';

import AppLoader from '../../components/AppLoader';
import type { MapTransform } from '../../components/HomeMap';
import HomeMap from '../../components/HomeMap';
import ApiClient from '../../api';
import { useDispatch } from '../../store/hooks';
import { routes } from '../../app/router';
import type { DialogValue as PlanSettingsValue } from '../../components/PlanSettingsDialog';
import { PlanSettingsDialog } from '../../components/PlanSettingsDialog';
import { getDeviceDefaultIcon } from '../../utils/device';

import actions from './actions';
import { exportPlan, importPlan, toRelativePosition } from './tools';
import UnsavedChangesDialog from './components/UnsavedChangesDIalog';
import { DeviceToolbar } from './components/DeviceToolbar';
import type { PlanActionEvent  } from './components/EditorTopbar';
import { EditorTopbar,PlanActionsEnum  } from './components/EditorTopbar';

import { LinearProgress } from './components/LinearProgress';
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
    const mapTransform = useRef<{scale: number, bounds: DOMRect} | undefined>(null);

    // Devices state
    const [allDevices, setAllDevices] = useState<Collection<Device>>({});
    const [selectedPlanDevice, setSelectedPlanDevice] = useState<PlanDevice | undefined>(undefined);
    /**
     * @deprecated
     */
    const [selectedPlanDeviceDrag, setSelectedPlanDeviceDrag] = useState<boolean>(false);

    useEffect(() => {
        if (selectedPlanDevice?.id) {
            setSelectedPlanDevice(plan?.devices[selectedPlanDevice.id]);
        }
    }, [plan?.devices, selectedPlanDevice?.id]);

    // Plan settings dialog state
    const [planSettingsOpen, setPlanSettingsOpen] = useState<boolean>(false);
    const [planSettingsValue, setPlanSettingsValue] = useState<PlanSettingsValue>();

    const planDevices = useMemo(() => plan?.devices ?? {}, [plan]);

    const planBounds: Partial<Bounds> = useMemo(() => ({
        top: 0,
        left: 0,
        right: plan?.width,
        bottom: plan?.height,
    }), [plan?.width, plan?.height]);

    const sensorsData = useMemo<Collection<Device>>(() => {
        return Object.fromEntries(
            Object.entries(allDevices)
                .filter(([, device]) => device.type === DeviceTypes.Sensor)
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
    };

    const handleExitToView = () => {
        navigate(`${routes.view}/${planId}`);
    };

    /**
     * Plan handlers
     */
    const setPlanDevices = useCallback((updatedDevices: Collection<PlanDevice>) => {
        setPlan({
            ...plan!,
            devices: updatedDevices,
        });
    }, [plan]);

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
    };

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
                };

                Object.assign(updatedPlan.devices, updatedDevice);
            });

            // Update state
            setPlan(updatedPlan);

            dispatch.alerts.success('Устройства синхронизированы. Не забудьте сохранить изменения.');
        } catch {
            dispatch.alerts.error('Ошибка при синхронизации');
        }
    };

    const handleExport = async () => {
        if (!plan) {
            return;
        }

        try {
            await exportPlan(plan);
        } catch {
            dispatch.alerts.error('Ошибка при экспорте');
        }
    };

    const handleImport = async (file: File) => {
        if (!plan) {
            return;
        }

        try {
            const importedPlan = await importPlan(file);
            setPlan(importedPlan);
            dispatch.alerts.success('План загружен. Не забудьте сохранить изменения.');
        } catch {
            dispatch.alerts.error('Ошибка при импорте');
        }
    };

    /**
     * Plan settings dialog
     */
    const handleShowSettings = () => {
        setPlanSettingsValue(plan);
        setPlanSettingsOpen(true);
    };

    const handleCloseSettings = async () => {
        setPlanSettingsOpen(false);
    };

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
    };

    /**
     * Map handlers
     */
    const handleTransform = useCallback(({scale, bounds}: MapTransform) => {
        mapTransform.current = {scale, bounds};
    }, []);

    /**
     * Device hanlders
     */
    
    const handleChangeDevice = useCallback((device: PlanDevice) => {
        setPlanDevices({
            ...planDevices,
            [device.id]: device,
        });
        setHasUnsavedChanges(true);
    }, [planDevices, setPlanDevices]);

    const handleDeleteDevice = useCallback((deviceId: string) => {
        const updatedplanDevices = {...planDevices};
        delete updatedplanDevices[deviceId];
        setPlanDevices(updatedplanDevices);
        setSelectedPlanDevice(undefined);
        setHasUnsavedChanges(true);
    }, [planDevices, setPlanDevices]);

    const handleAddDevice = useCallback((id: string, e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        const { bounds, scale } = mapTransform.current || {};
        const device = allDevices[id];
        const icon = getDeviceDefaultIcon(device.type);
        const position = toRelativePosition(
            [e.clientX, e.clientY], 
            {
                top: bounds?.top ?? 0,
                left: bounds?.left ?? 0,
            },
            scale ?? 1,
        );
        const newDevice = actions.addDevice(device, { icon, position }, planBounds);

        const updatedplanDevices = {
            [id]: newDevice,
            ...planDevices,
        };

        setPlanDevices(updatedplanDevices);
        setSelectedPlanDevice(newDevice);
        setSelectedPlanDeviceDrag(true);
        setHasUnsavedChanges(true);
    }, [allDevices, planBounds, planDevices, setPlanDevices]);

    const handleSelectDevice = useCallback((id: string) => {
        setSelectedPlanDevice(planDevices[id]);
        setSelectedPlanDeviceDrag(false);
    }, [planDevices]);

    const handleClickDevice = useCallback((id: string) => {
        setSelectedPlanDevice(planDevices[id]);
        setSelectedPlanDeviceDrag(false);
    }, [planDevices]);

    /**
     * Drag hanlders
     */
    const handleDragDevice = useCallback((id: string, positionDiff: Point) => {
        const updatedDevice = actions.updateDevicePositionByDiff(planDevices[id], positionDiff, planBounds, true);
        setSelectedPlanDevice(updatedDevice);
    }, [planBounds, planDevices]);

    const handleDragDeviceEnd = useCallback((id: string, positionDiff: Point) => {
        const updatedDevice = actions.updateDevicePositionByDiff(planDevices[id], positionDiff, planBounds, true);
        handleChangeDevice(updatedDevice);
    }, [handleChangeDevice, planBounds, planDevices]);

    const handleBulbsLinePointDrag = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceBulbsPointByDiff(planDevices[id], index, position, planBounds, true);
        setSelectedPlanDevice(updatedDevice);
    }, [planBounds, planDevices]);
    
    const handleBulbsLinePointDragEnd = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceBulbsPointByDiff(planDevices[id], index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }, [handleChangeDevice, planBounds, planDevices]);

    const handleShadowPointDrag = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceShadowPointByDiff(planDevices[id], index, position, planBounds, true);
        setSelectedPlanDevice(updatedDevice);
    }, [planBounds, planDevices]);

    const handleShadowPointDragEnd = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceShadowPointByDiff(planDevices[id], index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }, [handleChangeDevice, planBounds, planDevices]);

    const handleShadowMaskPointDrag = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceShadowMaskPointByDiff(planDevices[id], index, position, planBounds, true);
        setSelectedPlanDevice(updatedDevice);
    }, [planBounds, planDevices]);

    const handleShadowMaskPointDragEnd = useCallback((id: string, index: number, position: Point) => {
        const updatedDevice = actions.updateDeviceShadowMaskPointByDiff(planDevices[id], index, position, planBounds, true);
        handleChangeDevice(updatedDevice);
    }, [handleChangeDevice, planBounds, planDevices]);

    return ( <>
            <AppLoader isLoading={isLoading || !mapReady} />
            {plan && (
                <div className="editor-root">
                    <Box>
                        {actionsInProgress.length > 0 && <LinearProgress />}
                        <EditorTopbar
                            actionsInProgress={actionsInProgress}
                            onItemClick={handleClickPlanAction}
                        />
                        <DeviceToolbar
                            devices={allDevices}
                            devicesOnPlan={planDevices}
                            selectedDevice={selectedPlanDevice}
                            planBounds={planBounds}
                            onSelectDevice={handleSelectDevice}
                            onAddDevice={handleAddDevice}
                            onChangeDevice={handleChangeDevice}
                            onDeleteDevice={handleDeleteDevice}
                        />
                    </Box>

                    <HomeMap
                        data={sensorsData}
                        background={plan.background}
                        width={plan.width}
                        height={plan.height}
                        elements={planDevices}
                        allowZoom={true}
                        allowDrag={true}
                        allowInitialScale={true}
                        editableElement={selectedPlanDevice}
                        editElementDrag={selectedPlanDeviceDrag}
                        isEditorMode={true}
                        onElementClick={handleClickDevice}
                        onElementDrag={handleDragDevice}
                        onElementDragEnd={handleDragDeviceEnd}
                        onBulbsLinePointDrag={handleBulbsLinePointDrag}
                        onBulbsLinePointDragEnd={handleBulbsLinePointDragEnd}
                        onShadowPointDrag={handleShadowPointDrag}
                        onShadowPointDragEnd={handleShadowPointDragEnd}
                        onShadowMaskPointDrag={handleShadowMaskPointDrag}
                        onShadowMaskPointDragEnd={handleShadowMaskPointDragEnd}
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
    );
};

export default HomeEditor;
