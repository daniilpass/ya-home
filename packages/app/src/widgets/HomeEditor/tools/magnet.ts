import type { Point, PlanDevice } from '@homemap/shared';

const MAGNET_RADIUS = 10;

const getMagnetPoint = (x: number, y: number, anchorX: number, anchorY: number, magnetRadius: number) => {
    let magnetX;
    let magnetY;
    if (x >= anchorX - magnetRadius && x <= anchorX + magnetRadius) {
        magnetX = anchorX;
    }
    if (y >= anchorY - magnetRadius && y <= anchorY + magnetRadius) {
        magnetY = anchorY;
    }
    return [magnetX, magnetY];
};

const getMagnetPointsForAnchors = (
    position: Point,
    ignorePosition: Point | null,
    ...anchors: Array<Array<Point>>
) => {
    let magnetX;
    let magnetY;
    const [x, y] = position;
    const [ignoreX, ignorY] = ignorePosition || [];

    for (const anchorPoints of anchors) {
        for (const [anchorX, anchorY] of anchorPoints) {
            if (ignoreX === anchorX && ignorY === anchorY) {
                continue;
            }

            const [nextMagnetX, nextMagnetY] = getMagnetPoint(x, y, anchorX, anchorY, MAGNET_RADIUS);
            magnetX = magnetX ?? nextMagnetX;
            magnetY = magnetY ?? nextMagnetY;

            if (magnetX && magnetY) {
                return [magnetX, magnetY];
            }
        }
    }

    return [magnetX, magnetY];
};

export const getMagnetPoints = (
    point: Point,
    ignorePoint: Point | null,
    device: PlanDevice,
) => getMagnetPointsForAnchors(
    point,
    ignorePoint,
    device.area?.shadowPoints || [],
    device.area?.shadowMaskPoints || [],
    device.area?.bulbsLinePoints || [],
    [device.position]
);