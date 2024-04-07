import { useLayoutEffect, useRef, useState } from 'react';

import { DeviceState, DeviceStateKeys, DeviceStateType, Point } from '@homemap/shared';

import { useTransformContext } from '../../../providers/TransformContextProvider';
import { DeviceIcon, DeviceIconName } from '../../../../DeviceIcon';

import { SensorInformer } from './Informer';
import './style.scss';

type ForeignObjectWrapperProps = React.SVGProps<SVGForeignObjectElement>

const ForeignObjectWrapper = ({ children, ...props }: ForeignObjectWrapperProps) => {
    const [size, setSize] = useState<{ width: number; height: number; }>({ width: 1, height: 1});
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            setSize({
                width: ref.current.scrollWidth,
                height: ref.current.scrollHeight,
            })
        }
    }, [ref.current?.scrollWidth, ref.current?.scrollHeight]);

    return (
        <foreignObject
            {...props}
            style={{
                ...props.style,
                width: size.width,
                height: size.height,
                overflow: 'visible',
            }}
        >
            <div ref={ref}>{children}</div>
        </foreignObject>
    )
}

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
        transformOrigin: `${position[0]}px ${position[1]}px`,
    };
    const stateEntries = Object.entries(state) as [DeviceStateKeys, DeviceStateType][];
    const isNoData = stateEntries.length === 0;

    return (
        <g style={elementStyle}>
            <ForeignObjectWrapper
                x={position[0]}
                y={position[1]}
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
