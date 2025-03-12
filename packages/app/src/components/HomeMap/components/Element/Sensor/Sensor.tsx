import { DeviceState, DeviceStateKeys, DeviceStateType, Point, deviceIcons } from '@homemap/shared';

import { useTransformContext } from '../../../providers/TransformContextProvider';
import { DeviceIcon } from '../../../../DeviceIcon';
import { ForeignObjectWrapper } from '../../ForeignObjectWrapper';

import { SensorInformer } from './Informer';
import './style.scss';

export type SensorElementProps = {
    position: Point;
    state: DeviceState;
    // TODO: show pending and lost state
    substate?: string;
}

export const SensorElement = ({ position, state, substate }: SensorElementProps) => {
    const { rotate } = useTransformContext();

    const elementStyle = {
        transform: `rotate(${-rotate}deg)`,
    }

    const stateEntries = Object.entries(state) as [DeviceStateKeys, DeviceStateType][];
    const isNoData = stateEntries.length === 0;

    return (
        <ForeignObjectWrapper
            x={position[0]}
            y={position[1]}
            rootClassName='sensor'
            rootStyle={elementStyle}
        >
            <>
                {stateEntries.map(([stateKey, stateEntry]) => (
                    <SensorInformer
                        key={stateKey}
                        type={stateKey}
                        state={stateEntry}
                    />
                ))}
                {isNoData && (
                    <DeviceIcon
                        name={deviceIcons.Sensor}
                        sx={{fill: 'white', verticalAlign: 'middle'}}
                    />
                )}
            </>
        </ForeignObjectWrapper>
    )
}
