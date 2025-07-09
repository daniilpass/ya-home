import cx from 'classnames';

import { Substate } from '../../../../../services/mapService/model/Substate';
import { useTransformContext } from '../../../providers/TransformContextProvider';
import { ELEMENT_RADIUS, ICON_SIZE } from '../../../constants';
import { DeviceIcon } from '../../../../DeviceIcon';
import type { ElementBaseProps } from '../types';

import './styles.css';

const SwitchableElement = ({ position, icon, state, substate, onClick, onSelect }: ElementBaseProps) => {
    const { rotate } = useTransformContext();

    const elementClassName = cx('element', {
        'element--on': state?.on?.value,
        'element--pending': substate === Substate.Pending,
        'element--synced': substate === Substate.Synced,
        'element--lost': substate === Substate.Lost,
    });

    const elementStyle = {
        transform: `rotate(${-rotate}deg)`,
        transformOrigin: `${position[0]}px ${position[1]}px`,
    };

    const handleRootClick = () => {
        onClick?.();
        onSelect?.();
    };

    return (
        <g
            className={elementClassName}
            style={elementStyle}
            onClick={handleRootClick}
        >
            <circle
                className="element-shape"
                cx={position[0]}
                cy={position[1]}
                r={ELEMENT_RADIUS}
            />
            {icon && (
                <svg
                    className="element-icon"
                    x={position[0] - ICON_SIZE / 2}
                    y={position[1] - ICON_SIZE / 2}
                    width={ICON_SIZE} 
                    height={ICON_SIZE}
                >
                    <DeviceIcon name={icon} />
                </svg>
            )}
        </g>
    );
};

export default SwitchableElement;
