import { memo, useMemo } from 'react';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Collection, Device, PlanDevice } from '@homemap/shared';
import { DeviceTypes } from '@homemap/shared';


import DeviceList from '../../../../components/DeviceList';


type DialogAddDeviceProps = {
    devices: Collection<Device>;
    devicesOnPlan: Collection<PlanDevice>;
    open: boolean;
    onClose: () => void;
    onAdd: (id: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const DialogAddDevice = ({
    devices,
    devicesOnPlan,
    open,
    onClose,
    onAdd,
}: DialogAddDeviceProps) => {
    /**
     * Filtered supported devices not on plan
     */
    const supportedDevicesNotOnMap = useMemo<Collection<Device>>(() => {
        return Object.fromEntries(
            Object.entries(devices)
                .filter(([id, device]) => {
                    const isSupported = device.type !== DeviceTypes.Unknown;
                    const notOnPlan = !Object.hasOwn(devicesOnPlan, id);
                    return isSupported && notOnPlan;
                })
        );
    }, [devices, devicesOnPlan]);

    return (
        <Dialog
            open={open}
        >
            <DialogTitle>Устройства</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
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
                <DeviceList
                    items={supportedDevicesNotOnMap}
                    onItemClick={onAdd}
                    sx={{padding: 0, width: 400 }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default memo(DialogAddDevice);