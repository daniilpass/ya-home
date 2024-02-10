import { Box, Button, Divider, Typography } from '@mui/material';

import { Bounds, PlanDevice, Point } from '@homemap/shared';

import DeleteIcon from '@mui/icons-material/Delete';

import PointInput from '../../../../common/components/PointInput';
import PointsList from '../../../../common/components/PointsList';
import actions from '../../actions';

export type Props = {
    device: PlanDevice,
    bounds: Partial<Bounds>,
    onChange: (device: PlanDevice) => void;
    onDelete: (deviceId: string) => void;
}

const DeviceProperties = ({ device, bounds, onChange, onDelete }: Props) => {
    /**
     * Device hanlders
     */

    const handleDevicePositionChange = (position: Point, isMagnetic: boolean = false) => {
        const updatedDevice = actions.updateDevicePosition(device, position, bounds, isMagnetic);
        onChange(updatedDevice);
    }

    const handleDeviceDelete = () => {
        onDelete(device.id);
    }

    /**
     * Bulbs hanlders
     */

    const handleBulbsLinePointChange = (index: number, position: Point, isMagnetic: boolean = false) => {
        const updatedDevice = actions.updateDeviceBulbsPoint(device, index, position, bounds, isMagnetic);
        onChange(updatedDevice);
    }

    const handleBulbsLinePointDelete = (index: number) => {
        const updatedDevice = actions.deleteDeviceBulbsPoint(device, index);
        onChange(updatedDevice);
    }

    const handleBulbsLinePointAdd = () => {
        const updatedDevice = actions.addDeviceBulbsPoint(device, bounds);
        onChange(updatedDevice);
    }

    /**
     * Shadow hanlders
     */

    const handleShadowPointChange = (index: number, position: Point, isMagnetic: boolean = false) => {
        const updatedDevice = actions.updateDeviceShadowPoint(device, index, position, bounds, isMagnetic);
        onChange(updatedDevice);
    }

    const handleShadowPointDelete = (index: number) => {
        const updatedDevice = actions.deleteDeviceShadowPoint(device, index);
        onChange(updatedDevice);
    }

    const handleShadowPointAdd = () => {
        const updatedDevice = actions.addDeviceShadowPoint(device, bounds);
        onChange(updatedDevice);
    }

    /**
     * ShadowMask hanlders
     */

    const handleShadowMaskPointChange = (index: number, position: Point, isMagnetic: boolean = false) => {
        const updatedDevice = actions.updateDeviceShadowMaskPoint(device, index, position, bounds, isMagnetic);
        onChange(updatedDevice);
    }
    
    const handleShadowMaskPointDelete = (index: number) => {
        const updatedDevice = actions.deleteDeviceShadowMaskPoint(device, index);
        onChange(updatedDevice);
    }

    const handleShadowMaskPointAdd = () => {
        const updatedDevice = actions.addDeviceShadowMaskPoint(device, bounds);
        onChange(updatedDevice);
    }

    return (
        <>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                    {device.name}
                </Typography>
                <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeviceDelete()}
                >
                    Удалить
                </Button> 
            </Box>
                                        
            <Divider variant="middle" textAlign="left">Позиция</Divider>

            <Box sx={{p: 2}}>
                <PointInput
                    value={device.position}
                    onChange={(value) => handleDevicePositionChange(value)}
                />
            </Box>

            <Divider variant="middle" textAlign="left">Линия ламп</Divider>

            <Box sx={{p: 2}}>
                <PointsList
                    value={device.area?.bulbsLinePoints || []}
                    onChange={(index, value) => handleBulbsLinePointChange(index, value)}
                    onAdd={() => handleBulbsLinePointAdd()}
                    onDelete={(index) => handleBulbsLinePointDelete(index)}
                />
            </Box>
            
            <Divider variant="middle" textAlign="left">Тень</Divider>

            <Box sx={{p: 2}}>
                <PointsList
                    value={device.area?.shadowPoints || []}
                    onChange={(index, value) => handleShadowPointChange(index, value)}
                    onAdd={() => handleShadowPointAdd()}
                    onDelete={(index) => handleShadowPointDelete(index)}
                />
            </Box>
            
            <Divider variant="middle" textAlign="left">Маска тени</Divider>
            
            <Box sx={{p: 2}}>
                <PointsList
                    value={device.area?.shadowMaskPoints || []}
                    onChange={(index, value) => handleShadowMaskPointChange(index, value)}
                    onAdd={() => handleShadowMaskPointAdd()}
                    onDelete={(index) => handleShadowMaskPointDelete(index)}
                />
            </Box>
        </>
    )
}

export default DeviceProperties;
