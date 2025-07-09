import type { Bounds, Device, PlanDevice, Point, DeviceIconType, Orientation } from '@homemap/shared';


import { getMagnetPoints, limitPosition, applyPositionDiff } from '../tools';

export const addDevice = (device: Device, properties: Pick<PlanDevice, 'icon' | 'position'>, bounds: Partial<Bounds>): PlanDevice => {
    const newDevice: PlanDevice = {
        id: device.id,
        name: device.name,
        type: device.type,
        subtype: device.subtype,
        icon: properties.icon,
        position: limitPosition(properties.position, bounds),
    };

    return newDevice;
};

export const updateDevicePosition = (device: PlanDevice, newPosition: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    const [magnetX, magnetY] = isMagnetic
        ? getMagnetPoints(newPosition, device.position, device)
        : [undefined, undefined];

    return {
        ...device,
        position: limitPosition([magnetX ?? newPosition[0], magnetY ?? newPosition[1]], bounds),
    };
};

export const updateDevicePositionByDiff = (device: PlanDevice, positionDiff: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    const newPosition = applyPositionDiff(device.position, positionDiff);
    return updateDevicePosition(device, newPosition, bounds, isMagnetic);
};

export const updateDeviceIcon = (device: PlanDevice, newIcon: DeviceIconType): PlanDevice => {
    return {
        ...device,
        icon: newIcon,
    };
};

export const updateDeviceOrientation = (device: PlanDevice, orientation: Orientation): PlanDevice => {
    return {
        ...device,
        orientation,
    };
};