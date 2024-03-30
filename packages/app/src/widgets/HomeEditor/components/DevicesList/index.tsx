import { useState, useMemo, MouseEvent as ReactMouseEvent } from 'react';
import { 
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';

import { Collection, Device, DeviceTypes, PlanDevice } from '@homemap/shared';

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add';

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
                <List component="div" sx={{m: "0 -8px", p: 0}}>
                    {
                        Object.keys(devicesOnPlan).map(key => (
                            <ListItemButton
                                key={key}
                                selected={key === selectedDeviceId}
                                onClick={() => handleDeviceSelected(key)}
                                
                            >
                                <ListItemText primary={devicesOnPlan[key].name} />
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
                            Object.keys(supportedDevicesNotOnMap).map(key => (
                                <ListItemButton
                                    key={key}
                                    onClick={(e) => handleDeviceAddClick(key, e)}
                                >
                                    <ListItemText primary={supportedDevicesNotOnMap[key].name} />
                                </ListItemButton>
                            ))
                        }
                    </List>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DevicesList;
