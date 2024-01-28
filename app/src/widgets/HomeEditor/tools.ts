import {Point} from '../../common/types';
import {Element} from '../../services/configurationService/model/Element';

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
}


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
            magnetX = magnetX || nextMagnetX;
            magnetY = magnetY || nextMagnetY;

            if (magnetX && magnetY) {
                return [magnetX, magnetY];
            }
        }
    }

    return [magnetX, magnetY];
}

export const getMagnetPoints = (
    point: Point,
    ignorePoint: Point | null,
    device: Element
) => getMagnetPointsForAnchors(
    point,
    ignorePoint,
    device.area?.shadowPoints || [],
    device.area?.shadowMaskPoints || [],
    device.area?.bulbsLinePoints || [],
    [device.position]
);

export const getNormilizedDirection = (p1: Point, p2: Point): Point => {
    const vector = [p1[0] - p2[0], p1[1] - p2[1]];
    const magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    return [vector[0] / magnitude, vector[1] / magnitude];

}

export const getNextPoint = (p1: Point, p2: Point, step: number): Point => {
    const normDirection = getNormilizedDirection(p1, p2);
    return [p1[0] + normDirection[0] * step, p1[1] + normDirection[1] * step];
}
