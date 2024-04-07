import { useCallback, useState } from 'react';

import { DeviceState, DeviceStateKeys, DeviceStateType, Point, Size } from '@homemap/shared';

import { useTransformContext } from '../../../providers/TransformContextProvider';
import { DeviceIcon, DeviceIconName } from '../../../../DeviceIcon';
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
    const [foreignObjectSize, setForeignObjectSize] = useState<Size>({ width: 0, height: 0 });

    const elementStyle = {
        transform: `rotate(${-rotate}deg)`,
        transformOrigin: `${position[0] + foreignObjectSize.width / 2}px ${position[1] + foreignObjectSize.height / 2}px`,
    }

    const stateEntries = Object.entries(state) as [DeviceStateKeys, DeviceStateType][];
    const isNoData = stateEntries.length === 0;

    return (
        <g style={elementStyle}>
            <ForeignObjectWrapper
                x={position[0]}
                y={position[1]}
                onFit={setForeignObjectSize}
            >
                <div className='sensor'>
                    {stateEntries.map(([stateKey, stateEntry]) => (
                        <SensorInformer
                            key={stateKey}
                            type={stateKey}
                            state={stateEntry}
                        />
                    ))}
                    {isNoData && (
                        <DeviceIcon
                            name={DeviceIconName.Sensor}
                            sx={{fill: 'white', verticalAlign: 'middle'}}
                        />
                    )}
                </div>
            </ForeignObjectWrapper>
        </g>
    )
}
