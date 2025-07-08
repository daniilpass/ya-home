
import { type DeviceState, type Point, type DeviceIconType, DeviceStateKeys } from '@homemap/shared';

import { useTransformContext } from '../../../providers/TransformContextProvider';
import { ELEMENT_RADIUS } from '../../../constants';
import { getSensorStateValue } from '../../../../../utils/device';
import SwitchableElement from '../Switchable';

import styles from './styles.module.css';

type Props = {
    position: Point;
    icon?: DeviceIconType;
    state: DeviceState;
    substate?: string;
    onClick?: () => void;
}

export const AirConditioner = ({ position, icon, state, substate, onClick }: Props) => {
    const { rotate } = useTransformContext();

    const sensorState = state.targetTemperature;
    const sensorValue = sensorState && getSensorStateValue(DeviceStateKeys.TargetTemperature, sensorState)!.toString();

    return (
        <g>
            {/* Background */}
            <rect
                className={styles.acBackground}
                x={position[0] - ELEMENT_RADIUS * 2}
                y={position[1] - ELEMENT_RADIUS}
                width={ELEMENT_RADIUS * 4}
                height={ELEMENT_RADIUS * 2}
                rx={ELEMENT_RADIUS}
                ry={ELEMENT_RADIUS}
            />

            {/* Switch */}
            <SwitchableElement
                position={[position[0] - ELEMENT_RADIUS, position[1]]}
                icon={icon as DeviceIconType}
                state={state}
                substate={substate}
                onClick={onClick}
            />

            {/* Info */}
            <g
                style={{
                    transform: `rotate(${-rotate}deg)`,
                    transformOrigin: `${position[0] + ELEMENT_RADIUS }px ${position[1]}px`,
                }}
            >
                <circle
                    className={styles.acInfoBackground}
                    cx={position[0] + ELEMENT_RADIUS}
                    cy={position[1]}
                    r={ELEMENT_RADIUS}
                />
                <text
                    className={styles.acInfoText}
                    x={position[0] + ELEMENT_RADIUS}
                    y={position[1]}
                    textAnchor="middle"
                    dx="-.1em"
                    dy=".3em"
                >
                    {sensorValue}
                </text>
            </g>
        </g>
    );
};

