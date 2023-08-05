import {Point} from '../../../services/configurationService/model/Area';

enum SVG_PATH_ACTIONS {
    MOVE_TO = 'M',
    LINE_TO ='L',
}

const SVG_PATH_ACTIONS_DELIMITER = ' ';

export const pointsToPathDirections = (points: Point[]) => {
    const directions: string[] = [];

    points.forEach(([x,y], index) => {
        const action = index === 0 ? SVG_PATH_ACTIONS.MOVE_TO : SVG_PATH_ACTIONS.LINE_TO;
        const coordinates = `${x},${y}`;
        directions.push(action, coordinates);
    })

    return directions.join(SVG_PATH_ACTIONS_DELIMITER);
}