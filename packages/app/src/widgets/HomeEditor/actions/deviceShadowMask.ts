import type { Bounds, PlanDevice, Point } from '@homemap/shared';

import { ELEMENT_RADIUS } from '../../../components/HomeMap/constants';
import { applyPositionDiff, getMagnetPoints, getNewPointsForSquare, limitPosition, limitPositions } from '../tools';

export const updateDeviceShadowMaskPoint = (device: PlanDevice, itemIndex: number, newPosition: Point, bounds: Partial<Bounds>, isMagnetic: boolean = false): PlanDevice => {
    if (!device.area?.shadowMaskPoints) {
        return device;
    }

    let [magnetX, magnetY] = new Array<number | undefined>(2);
    if (isMagnetic) {
        const originPoint = device.area.shadowMaskPoints[itemIndex];
        [magnetX, magnetY] = getMagnetPoints(newPosition, originPoint, device);
    }

    const updatedDeviceAreaShadowMaskPoints = [...device.area.shadowMaskPoints];
    updatedDeviceAreaShadowMaskPoints[itemIndex] = limitPosition([magnetX ?? newPosition[0], magnetY ?? newPosition[1]], bounds);

    return {
        ...device,
        area: {
            ...device.area,
            shadowMaskPoints: updatedDeviceAreaShadowMaskPoints,
        }
    };
};

export const updateDeviceShadowMaskPointByDiff = (device: PlanDevice, itemIndex: number, positionDiff: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    if (!device.area?.shadowMaskPoints) {
        return device;
    }

    const originPosition = device.area.shadowMaskPoints[itemIndex];
    const newPosition = applyPositionDiff(originPosition, positionDiff);
    return updateDeviceShadowMaskPoint(device, itemIndex, newPosition, bounds, isMagnetic);
};

export const deleteDeviceShadowMaskPoint = (device: PlanDevice, itemIndex: number): PlanDevice  => {
    if (!device.area?.shadowMaskPoints) {
        return device;
    }

    const updatedDeviceAreaShadowMaskPoints = [...device.area.shadowMaskPoints];
    updatedDeviceAreaShadowMaskPoints.splice(itemIndex, 1);

    
    return {
        ...device,
        area: {
            ...device.area,
            shadowMaskPoints: updatedDeviceAreaShadowMaskPoints,
        }
    };
};

export const addDeviceShadowMaskPoint = (device: PlanDevice, bounds: Partial<Bounds>): PlanDevice => {
    const shadowMaskPoints = device.area?.shadowMaskPoints || [];
    const newPoints = limitPositions(getNewPointsForSquare(shadowMaskPoints, device.position, ELEMENT_RADIUS * 3), bounds);
    const updatedDeviceAreaShadowMaskPoints = [...shadowMaskPoints, ...newPoints];

    return {
        ...device,
        area: {
            ...device.area,
            shadowMaskPoints: updatedDeviceAreaShadowMaskPoints,
        }
    };
};