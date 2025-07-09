import { addDevice, updateDeviceIcon, updateDeviceOrientation, updateDevicePosition, updateDevicePositionByDiff } from './device';
import { updateDeviceBulbsPoint, updateDeviceBulbsPointByDiff, deleteDeviceBulbsPoint, addDeviceBulbsPoint } from './deviceBulbs';
import { updateDeviceShadowPoint, updateDeviceShadowPointByDiff, deleteDeviceShadowPoint, addDeviceShadowPoint } from './deviceShadow';
import { updateDeviceShadowMaskPoint, updateDeviceShadowMaskPointByDiff, deleteDeviceShadowMaskPoint, addDeviceShadowMaskPoint } from './deviceShadowMask';

const actions = {
    // Device
    addDevice,
    updateDevicePosition,
    updateDevicePositionByDiff,
    updateDeviceIcon,
    updateDeviceOrientation,
    // Device bulbs
    updateDeviceBulbsPoint,
    updateDeviceBulbsPointByDiff,
    deleteDeviceBulbsPoint,
    addDeviceBulbsPoint,
    // Device shadow
    updateDeviceShadowPoint,
    updateDeviceShadowPointByDiff,
    deleteDeviceShadowPoint,
    addDeviceShadowPoint,
    // Device shadow mask
    updateDeviceShadowMaskPoint,
    updateDeviceShadowMaskPointByDiff,
    deleteDeviceShadowMaskPoint,
    addDeviceShadowMaskPoint,
};

export default actions;