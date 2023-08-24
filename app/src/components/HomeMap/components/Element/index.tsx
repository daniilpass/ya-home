import {FC, useMemo} from 'react';
import cx from 'classnames'

import {Position} from '../../../../services/configurationService/model/Position';
import {State} from '../../../../services/mapService/model/State';
import {Substate} from '../../../../services/mapService/model/Substate';
import {useTransformContext} from '../../providers/TransformContextProvider';
import {useDrag} from '../../hooks/useDrage';

import './styles.css';

type Props = {
    position: Position;
    icon?: string;
    state?: string;
    substate?: string;
    isEditMode?: boolean;
    onClick?: () => void;
    onDrag?: (pageX: number, pageY: number) => void;
}

export const ELEMENT_RADIUS = 20;

const createSvgFromString = (svgString: string) => {
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();
    return div.children[0];
}

const Element: FC<Props> = ({position, icon, state, substate, isEditMode, onClick, onDrag}) => {
    const {rotateDegree} = useTransformContext();
    const onDragStart = useDrag(onDrag);

    const svgIcon = useMemo(() => {
        return icon && createSvgFromString(icon);
    }, [icon]);

    const elementClassName = cx('element', {
        'element--on': state === State.On,
        'element--pending': substate === Substate.Pending,
        'element--synced': substate === Substate.Synced,
        'element--edit': isEditMode,
    });

    const elementStyle = {
        transform: `rotate(${-rotateDegree}deg)`,
        transformOrigin: `${position.x}px ${position.y}px`,
    };

    return (
        <g
            className={elementClassName}
            style={elementStyle}
            onClick={onClick}
            onMouseDown={isEditMode ? onDragStart : undefined}
        >
            <circle
                className='element-shape'
                cx={position.x}
                cy={position.y}
                r={ELEMENT_RADIUS}
            />
            {svgIcon && (
                <svg
                    className='element-icon'
                    x={position.x - ELEMENT_RADIUS / 2}
                    y={position.y - ELEMENT_RADIUS / 2}
                    width={ELEMENT_RADIUS} 
                    height={ELEMENT_RADIUS}
                    viewBox={svgIcon.getAttribute("viewBox") || undefined}
                    dangerouslySetInnerHTML={{__html: svgIcon.innerHTML}}
                >
                </svg>
            )} 
        </g>
    )
}

export default Element;
