import type { Bounds, PlanDevice, Point } from '@homemap/shared';

import { ELEMENT_RADIUS } from '../../../components/HomeMap/constants';
import { applyPositionDiff, getMagnetPoints, getNewPointsForSquare, limitPosition, limitPositions } from '../tools';

export const updateDeviceShadowPoint = (device: PlanDevice, itemIndex: number, newPosition: Point, bounds: Partial<Bounds>, isMagnetic: boolean = false): PlanDevice => {
    if (!device.area?.shadowPoints) {
        return device;
    }

    let [magnetX, magnetY] = new Array<number | undefined>(2);
    if (isMagnetic) {
        const originPoint = device.area.shadowPoints[itemIndex];
        [magnetX, magnetY] = getMagnetPoints(newPosition, originPoint, device);
    }

    const updatedDeviceAreaShadowPoints = [...device.area.shadowPoints];
    updatedDeviceAreaShadowPoints[itemIndex] = limitPosition([magnetX ?? newPosition[0], magnetY ?? newPosition[1]], bounds);

    
    return {
        ...device,
        area: {
            ...device.area,
            shadowPoints: updatedDeviceAreaShadowPoints,
        }
    };
};

export const updateDeviceShadowPointByDiff = (device: PlanDevice, itemIndex: number, positionDiff: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    if (!device.area?.shadowPoints) {
        return device;
    }

    const originPosition = device.area.shadowPoints[itemIndex];
    const newPosition = applyPositionDiff(originPosition, positionDiff);
    return updateDeviceShadowPoint(device, itemIndex, newPosition, bounds, isMagnetic);
};

export const deleteDeviceShadowPoint = (device: PlanDevice, itemIndex: number): PlanDevice => {
    if (!device.area?.shadowPoints) {
        return device;
    }

    const updatedDeviceAreaShadowPoints = [...device.area.shadowPoints];
    updatedDeviceAreaShadowPoints.splice(itemIndex, 1);
    
    return {
        ...device,
        area: {
            ...device.area,
            shadowPoints: updatedDeviceAreaShadowPoints,
        }
    };
};

export const addDeviceShadowPoint = (device: PlanDevice, bounds: Partial<Bounds>): PlanDevice => {
    const shadowPoints = device.area?.shadowPoints || [];
    const newPoints = limitPositions(getNewPointsForSquare(shadowPoints, device.position, ELEMENT_RADIUS * 4), bounds);
    const updatedDeviceAreaShadowPoints = [...shadowPoints, ...newPoints];
    
    return {
        ...device,
        area: {
            ...device.area,
            shadowPoints: updatedDeviceAreaShadowPoints,
        }
    };
};