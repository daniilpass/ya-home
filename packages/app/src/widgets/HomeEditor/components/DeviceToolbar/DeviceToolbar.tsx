
import { useCallback, useEffect, useState } from 'react';

import cx from 'classnames';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import type { Bounds, Collection, Device, PlanDevice } from '@homemap/shared';
import { COLORS } from '@homemap/shared';

import DeviceProperties from '../DeviceProperties';
import Toolbar from '../../../../common/components/Toolbar';
import DeviceSelect from '../../../../components/DeviceSelect';
import { useIsMobile } from '../../../../hooks/useIsMobile';

import DialogAddDevice from './DialogAddDevice';
import './DeviceToolbar.css';

type DeviceToolbarProps = {
    devices: Collection<Device>;
    devicesOnPlan: Collection<PlanDevice>;
    selectedDevice: PlanDevice | undefined;
    planBounds: Partial<Bounds>;
    onSelectDevice: (deviceId: string) => void;
    onAddDevice: (deviceId: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onChangeDevice: (device: PlanDevice) => void;
    onDeleteDevice: (deviceId: string) => void;
}

export const DeviceToolbar = ({
    devices,
    devicesOnPlan,
    selectedDevice,
    planBounds,
    onSelectDevice,
    onAddDevice,
    onChangeDevice,
    onDeleteDevice,
}: DeviceToolbarProps) => {
    /**
     * Edit view logic
     */
    const isMobile = useIsMobile();
    const [isMobileEditMode, setIsMobileEditMode] = useState<boolean>(false);

    const showProperties = isMobileEditMode || !isMobile;
    const showDeviceSelect = !isMobileEditMode;
    const showCloseEditMode = isMobileEditMode;

    useEffect(() => {
        setIsMobileEditMode(false);
    }, [isMobile]);

    const toggleMobileEditMode = useCallback(() => {
        setIsMobileEditMode(!isMobileEditMode);
    }, [isMobileEditMode]);

    /**
     * Modal logic
     */
    const [addDeviceModalOpened, setAddDeviceModalOpened] = useState<boolean>(false);

    const addDeviceModalOpen = useCallback(() => {
        setAddDeviceModalOpened(true);
    }, []);

    const addDeviceModalClose = useCallback(() => {
        setAddDeviceModalOpened(false);
    }, []);

    const handleOnAddDevice = useCallback((deviceId: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        addDeviceModalClose();
        onAddDevice(deviceId, e);
    }, [addDeviceModalClose, onAddDevice]);

    const className = cx('toolbar-device', {
        'toolbar-device--mobile': isMobile,
        'toolbar-device--mobile-open': isMobile && isMobileEditMode,
    });
    const positon = isMobile ? 'bottom' : 'left';

    return (
        <Toolbar className={className} position={positon} >
            {showCloseEditMode && (
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    gap: '6px',
                    padding: '12px',
                    borderBottom: '1px solid #e6eaf2',
                    justifyContent: 'flex-end',
                }}>
                    <IconButton onClick={toggleMobileEditMode} sx={{ color: COLORS.primary }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {showDeviceSelect && (
                <Box sx={{
                    display: 'flex',
                    gap: '6px',
                    padding: '12px',
                    borderBottom: '1px solid #e6eaf2'
                }}>
                    <IconButton onClick={addDeviceModalOpen} sx={{ color: COLORS.primary }}>
                        <AddIcon />
                    </IconButton>
                    <DeviceSelect
                        items={devicesOnPlan}
                        selectedItemId={selectedDevice?.id}
                        onChange={onSelectDevice}
                    />
                    {isMobile && (
                        <IconButton
                            onClick={toggleMobileEditMode}
                            disabled={!selectedDevice}
                            sx={{ color: COLORS.primary }}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
            )}
            
            {showProperties && selectedDevice && (
                <DeviceProperties
                    device={selectedDevice}
                    bounds={planBounds}
                    // hideTitle
                    onChange={onChangeDevice}
                    onDelete={onDeleteDevice}
                />
            )}

            <DialogAddDevice
                devices={devices}
                devicesOnPlan={devicesOnPlan}
                open={addDeviceModalOpened}
                onClose={addDeviceModalClose}
                onAdd={handleOnAddDevice}
            />
        </Toolbar>
    );
};