
import { Orientation, DeviceStateKeys } from '@homemap/shared';


import { useTransformContext } from '../../../providers/TransformContextProvider';
import { ELEMENT_RADIUS } from '../../../constants';
import { getSensorStateValue } from '../../../../../utils/device';

import type { AirConditionerProps } from './types';
import styles from './styles.module.css';

export const AirConditionerInfo = ({ position, state, orientation }: Pick<AirConditionerProps, 'position' | 'orientation' | 'state'>) => {
    const { rotate } = useTransformContext();

    const sensorState = state.targetTemperature;
    const sensorValue = sensorState && getSensorStateValue(DeviceStateKeys.TargetTemperature, sensorState)!.toString();

    const horizontal = orientation === Orientation.Horizontal;
    const infoX = horizontal ? position[0] + ELEMENT_RADIUS : position[0];
    const infoY = horizontal ? position[1] : position[1] - ELEMENT_RADIUS;
    const infoDx = horizontal ? '-.1em' : undefined;
    const infoDy = '.3em';

    return (
        <g
            style={{
                transform: `rotate(${-rotate}deg)`,
                transformOrigin: `${infoX}px ${infoY}px`,
            }}
        >
            <text
                className={styles.acInfoText}
                x={infoX}
                y={infoY}
                textAnchor="middle"
                dx={infoDx}
                dy={infoDy}
            >
                {sensorValue}
            </text>
        </g>
    );
};