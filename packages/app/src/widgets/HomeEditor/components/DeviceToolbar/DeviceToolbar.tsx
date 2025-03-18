
import { useCallback, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';

import { Bounds, Collection, COLORS, Device, PlanDevice } from '@homemap/shared';

import DeviceProperties from '../DeviceProperties'
import Toolbar from '../../../../common/components/Toolbar';
import DeviceSelect from '../../../../components/DeviceSelect';
import DialogAddDevice from './DialogAddDevice';

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
    }, [addDeviceModalClose, onAddDevice])


    return (
        <Toolbar position="left" >
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
                {/* <IconButton sx={{ color: COLORS.primary }}>
                    <EditIcon />
                </IconButton> */}
            </Box>
            
            {selectedDevice && (
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
}