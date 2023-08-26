export const getMagnetPoints = (x: number, y: number, anchorX: number, anchorY: number, magnetRadius: number) => {
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
