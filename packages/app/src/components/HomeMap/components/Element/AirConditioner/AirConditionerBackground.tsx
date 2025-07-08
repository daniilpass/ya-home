
import { Orientation } from '@homemap/shared';


import { ELEMENT_RADIUS } from '../../../constants';

import type { AirConditionerProps } from './types';
import styles from './styles.module.css';

export const AirConditionerBackground = ({ position, orientation }: Pick<AirConditionerProps, 'position' | 'orientation'>) => {
    const horizontal = orientation === Orientation.Horizontal;
    const backgroundWidth = ELEMENT_RADIUS * 4;
    const backgroundHeight = ELEMENT_RADIUS * 2;
    const backgroundX = horizontal ? position[0] - ELEMENT_RADIUS * 2 : position[0] - ELEMENT_RADIUS;
    const backgroundY = horizontal ? position[1] - ELEMENT_RADIUS : position[1] - ELEMENT_RADIUS * 2;

    return (
        <rect
            className={styles.acBackground}
            x={backgroundX}
            y={backgroundY}
            width={horizontal ? backgroundWidth : backgroundHeight}
            height={horizontal ? backgroundHeight : backgroundWidth}
            rx={ELEMENT_RADIUS}
            ry={ELEMENT_RADIUS}
        />
    );
};