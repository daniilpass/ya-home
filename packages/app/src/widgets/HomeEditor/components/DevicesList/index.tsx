import { useState, useMemo, MouseEvent as ReactMouseEvent } from 'react';
import { 
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';

import { Collection, Device, DeviceTypes, PlanDevice } from '@homemap/shared';

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add';
import DeviceList from '../../../../components/DeviceList';

export type Props = {
    devices: Collection<Device>;
    devicesOnPlan: Collection<PlanDevice>;
    selectedDeviceId?: string;
    onDeviceSelected: (deviceId: string) => void;
    onDeviceAddClick: (deviceId: string, event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const DevicesList = ({ devices, devicesOnPlan, selectedDeviceId, onDeviceSelected, onDeviceAddClick }: Props) => {
    const [addDeviceModalOpened, setAddDeviceModalOpened] = useState<boolean>(false);

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

    /**
     * Element hanlders
     */

    const handleDeviceAddClick = (id: string, e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        setAddDeviceModalOpened(false);
        onDeviceAddClick(id, e);
    }

    const handleDeviceSelected = (id: string) => {
        onDeviceSelected(id);
    }

    return (<>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                    Устройства
                </Typography>
                <Button startIcon={<AddIcon />} onClick={() => setAddDeviceModalOpened(true)}>
                    Добавить
                </Button>
            </Box>
            <Box sx={{p: "0 8px"}}>
                <DeviceList
                    items={devicesOnPlan}
                    selectedItemId={selectedDeviceId}
                    withTooltip
                    onItemClick={handleDeviceSelected}
                    sx={{m: "0 -8px", p: 0}}
                />
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
                    <DeviceList
                        items={supportedDevicesNotOnMap}
                        onItemClick={handleDeviceAddClick}
                        sx={{padding: 0, width: 400 }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DevicesList;
