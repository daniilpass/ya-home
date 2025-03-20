import { memo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Bounds, DeviceTypes, PlanDevice, Point } from '@homemap/shared';
import { deviceIcons, DeviceIconType } from '@homemap/shared';

import PointInput from '../../../../common/components/PointInput';
import PointsList from '../../../../common/components/PointsList';
import actions from '../../actions';
import { IconPicker } from '../IconPicker';
import { PropertiesGroup } from './PropertiesGroup';

export type Props = {
    device: PlanDevice,
    bounds: Partial<Bounds>,
    hideTitle?: boolean;
    onChange: (device: PlanDevice) => void;
    onDelete: (deviceId: string) => void;
}

// TODO: оптимизировать, при драге свойства обновляются - компонент ререндерится
const DeviceProperties = ({ device, bounds, hideTitle, onChange, onDelete }: Props) => {
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

    const handleDeviceIconChanged = (icon: DeviceIconType) => {
        const updatedDevice = actions.updateDeviceIcon(device, icon);
        onChange(updatedDevice);
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

    const isShowLightProperties = device.type === DeviceTypes.Light || device.type === DeviceTypes.Switch;

    return (
        <>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                {!hideTitle && (
                    <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                        {device.name}
                    </Typography>
                )}
                <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeviceDelete()}
                >
                    Удалить
                </Button>
            </Box>

            {device.type !== DeviceTypes.Sensor && (
                <PropertiesGroup title="Иконка">
                    <IconPicker
                        value={device.icon as DeviceIconType}
                        options={Object.values(deviceIcons)}
                        onChange={handleDeviceIconChanged}
                    />
                </PropertiesGroup>
            )}

            <PropertiesGroup title="Позиция">
                <PointInput
                    value={device.position}
                    onChange={(value) => handleDevicePositionChange(value)}
                />
            </PropertiesGroup>

            {isShowLightProperties && (
                <>
                    <PropertiesGroup title="Линия ламп">
                        <PointsList
                            value={device.area?.bulbsLinePoints || []}
                            onChange={(index, value) => handleBulbsLinePointChange(index, value)}
                            onAdd={() => handleBulbsLinePointAdd()}
                            onDelete={(index) => handleBulbsLinePointDelete(index)}
                        />
                    </PropertiesGroup>


                    <PropertiesGroup title="Тень">
                        <PointsList
                            value={device.area?.shadowPoints || []}
                            onChange={(index, value) => handleShadowPointChange(index, value)}
                            onAdd={() => handleShadowPointAdd()}
                            onDelete={(index) => handleShadowPointDelete(index)}
                        />
                    </PropertiesGroup>

                    <PropertiesGroup title="Маска тени">
                        <PointsList
                            value={device.area?.shadowMaskPoints || []}
                            onChange={(index, value) => handleShadowMaskPointChange(index, value)}
                            onAdd={() => handleShadowMaskPointAdd()}
                            onDelete={(index) => handleShadowMaskPointDelete(index)}
                        />
                    </PropertiesGroup>
                </>
            )}
        </>
    )
}

export default memo(DeviceProperties);
