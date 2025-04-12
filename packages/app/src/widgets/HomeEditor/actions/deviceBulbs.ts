import type { Bounds, PlanDevice, Point } from '@homemap/shared';

import { ELEMENT_RADIUS } from '../../../components/HomeMap/constants';
import { applyPositionDiff, getMagnetPoints, getNewPointsForLine, limitPosition, limitPositions } from '../tools';

export const updateDeviceBulbsPoint = (device: PlanDevice, itemIndex: number, newPosition: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    if (!device.area?.bulbsLinePoints) {
        return device;
    }

    let [magnetX, magnetY] = new Array<number | undefined>(2);
    if (isMagnetic) {
        const originPoint = device.area.bulbsLinePoints[itemIndex];
        [magnetX, magnetY] = getMagnetPoints(newPosition, originPoint, device);
    }

    const updatedDeviceAreaBulbsLinePoints = [...device.area.bulbsLinePoints];
    updatedDeviceAreaBulbsLinePoints[itemIndex] = limitPosition([magnetX ?? newPosition[0], magnetY ?? newPosition[1]], bounds);

    
    return {
        ...device,
        area: {
            ...device.area,
            bulbsLinePoints: updatedDeviceAreaBulbsLinePoints,
        }
    };
}

export const updateDeviceBulbsPointByDiff = (device: PlanDevice, itemIndex: number, positionDiff: Point, bounds: Partial<Bounds>, isMagnetic?: boolean): PlanDevice => {
    if (!device.area?.bulbsLinePoints) {
        return device;
    }
    const originPosition = device.area.bulbsLinePoints[itemIndex];
    const newPosition = applyPositionDiff(originPosition, positionDiff);
    return updateDeviceBulbsPoint(device, itemIndex, newPosition, bounds, isMagnetic);
}

export const deleteDeviceBulbsPoint= (device: PlanDevice, itemIndex: number): PlanDevice => {
    if (!device.area?.bulbsLinePoints) {
        return device;
    }

    const updatedDeviceAreaBulbsLinePoints = [...device.area.bulbsLinePoints]
    updatedDeviceAreaBulbsLinePoints.splice(itemIndex, 1);

    return {
        ...device,
        area: {
            ...device.area,
            bulbsLinePoints: updatedDeviceAreaBulbsLinePoints,
        }
    };
}

export const addDeviceBulbsPoint = (device: PlanDevice, bounds: Partial<Bounds>): PlanDevice => {
    const bulbsPoints = device.area?.bulbsLinePoints || [];
    const newPoints = limitPositions(getNewPointsForLine(bulbsPoints, device.position, ELEMENT_RADIUS * 3), bounds);
    const updatedDeviceAreaBulbsLinePoints = [...bulbsPoints, ...newPoints]

    return {
        ...device,
        area: {
            ...device.area,
            bulbsLinePoints: updatedDeviceAreaBulbsLinePoints,
        }
    };
}