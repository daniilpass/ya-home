import { addDevice, updateDevicePosition } from './device';
import { updateDeviceBulbsPoint, deleteDeviceBulbsPoint, addDeviceBulbsPoint } from './deviceBulbs';
import { updateDeviceShadowPoint, deleteDeviceShadowPoint, addDeviceShadowPoint } from './deviceShadow';
import { updateDeviceShadowMaskPoint, deleteDeviceShadowMaskPoint, addDeviceShadowMaskPoint } from './deviceShadowMask';

const actions = {
    // Device
    addDevice,
    updateDevicePosition,
    // Device bulbs
    updateDeviceBulbsPoint,
    deleteDeviceBulbsPoint,
    addDeviceBulbsPoint,
    // Device shadow
    updateDeviceShadowPoint,
    deleteDeviceShadowPoint,
    addDeviceShadowPoint,
    // Device shadow mask
    updateDeviceShadowMaskPoint,
    deleteDeviceShadowMaskPoint,
    addDeviceShadowMaskPoint,
}

export default actions;