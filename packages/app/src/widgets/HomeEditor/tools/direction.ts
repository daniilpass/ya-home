import type { Point } from '@homemap/shared';

const getNormilizedDirection = (p1: Point, p2: Point): Point => {
    const vector = [p1[0] - p2[0], p1[1] - p2[1]];
    const magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    return magnitude === 0 ? [0, 0] : [vector[0] / magnitude, vector[1] / magnitude];

}

const getNextPoint = (p1: Point, p2: Point, step: number): Point => {
    const normDirection = getNormilizedDirection(p1, p2);
    return [p1[0] + normDirection[0] * step, p1[1] + normDirection[1] * step];
}

export const getNewPointsForLine = (existingPoints: Point[], center: Point, gap: number): Point[]  => {
    if (existingPoints.length === 0 ) {
        // No exising points - add two points from sides of center
        return [
            // left
            [center[0] - gap, center[1]],
            // right
            [center[0] + gap, center[1]]
        ];
    } else if (existingPoints.length === 1) {
        // One exising point - add point in direction specified by last point and center
        const newPoint = getNextPoint(center, existingPoints[0], gap);
        return [newPoint];
    } else {
        // More than one exising point - add point in direction specified by last points
        const newPoint = getNextPoint(existingPoints[existingPoints.length - 1], existingPoints[existingPoints.length - 2], gap);
        return [newPoint];
    }
}

export const getNewPointsForSquare = (existingPoints: Point[], center: Point, gap: number): Point[]  => {
    if (existingPoints.length === 0 ) {
        return [
            // top left
            [center[0] - gap, center[1] - gap],
            // top right
            [center[0] + gap, center[1] - gap],
            // bottom right
            [center[0] + gap, center[1] + gap],
            // bottom left
            [center[0] - gap, center[1] + gap],
        ]
    } else if (existingPoints.length === 1) {
        // One exising point - add point in direction specified by last point and center
        const bulbPosition = existingPoints[existingPoints.length - 1];
        const signX = Math.sign(center[0] - bulbPosition[0]) || 1;
        const newPoint: Point = [bulbPosition[0] + signX * gap * 2, bulbPosition[1]];
        return [newPoint];
    } else if (existingPoints.length === 2) {
        // Two exising point - add point in direction specified by last point and center
        const bulbPosition = existingPoints[existingPoints.length - 1];
        const signY = Math.sign(center[1] - bulbPosition[1]) || 1;
        const newPoint: Point = [bulbPosition[0], bulbPosition[1] + signY * gap * 2];
        return [newPoint];
    } else {
        // More than one exising point - add point in direction specified by last points
        const newPoint = getNextPoint(existingPoints[existingPoints.length - 1], existingPoints[existingPoints.length - 2], gap)
        return [newPoint];
    }
}