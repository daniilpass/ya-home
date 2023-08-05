import {FC, useMemo} from 'react';
import cx from 'classnames'

import {Position} from '../../../../services/configurationService/model/Position';
import {State} from '../../../../services/mapService/model/State';

import './styles.css';

type Props = {
    position: Position;
    icon?: string;
    state?: string;
    substate?: string;
}

export const ELEMENT_RADIUS = 20;

const createSvgFromString = (svgString: string) => {
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();
    return div.children[0];
}

const Element: FC<Props> = ({position, icon, state, substate}) => {
    const svgIcon = useMemo(() => {
        return icon && createSvgFromString(icon);
    }, [icon]);

    const elementClassName = cx('element', {
        'element--on': state === State.On
    });

    return (
        <g className={elementClassName}>
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
