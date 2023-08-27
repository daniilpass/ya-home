export type Point = [number, number];

const MAGNET_RADIUS =10;

const getMagnetPoints = (x: number, y: number, anchorX: number, anchorY: number, magnetRadius: number) => {
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


export const getMagnetPointsForAnchors = (
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

            const [magnetXToBulb, magnetYToBulb] = getMagnetPoints(x, y, anchorX, anchorY, MAGNET_RADIUS);
            magnetX = magnetX || magnetXToBulb;
            magnetY = magnetY || magnetYToBulb;

            if (magnetX && magnetY) {
                return [magnetX, magnetY];
            }
        }
    }

    return [magnetX, magnetY];
}