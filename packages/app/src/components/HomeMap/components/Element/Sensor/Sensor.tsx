import type { DeviceStateKeys, DeviceStateType } from '@homemap/shared';
import { deviceIcons } from '@homemap/shared';

import { useTransformContext } from '../../../providers/TransformContextProvider';
import { DeviceIcon } from '../../../../DeviceIcon';
import { ForeignObjectWrapper } from '../../ForeignObjectWrapper';
import type { ElementBaseProps } from '../types';

import { SensorInformer } from './Informer';

import './style.css';

export const SensorElement = ({ position, state, onClick, onSelect }: ElementBaseProps) => {
    const { rotate } = useTransformContext();

    const handleRootClick = () => {
        onClick?.();
        onSelect?.();
    };

    const elementStyle = {
        transform: `rotate(${-rotate}deg)`,
    };

    const stateEntries = Object.entries(state) as [DeviceStateKeys, DeviceStateType][];
    const isNoData = stateEntries.length === 0;

    return (
        <ForeignObjectWrapper
            x={position[0]}
            y={position[1]}
            rootClassName="sensor"
            rootStyle={elementStyle}
            onClick={handleRootClick}
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
                        sx={{ fill: 'white', verticalAlign: 'middle' }}
                    />
                )}
            </>
        </ForeignObjectWrapper>
    );
};
