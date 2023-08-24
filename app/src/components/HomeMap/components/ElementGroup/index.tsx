import {FC} from 'react';
import cx from 'classnames';

import {Element} from '../../../../services/configurationService/model/Element';
import {Element as MapElement} from '../../../../services/mapService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';

import './style.css';

type Props = {
    element: Element;
    data?: MapElement;
    isEditMode?: boolean;
    onElementClick?: () => void;
    onElementDrag?: (pageX:number, pageY: number) => void;
}

const ElementGroup: FC<Props> = ({element, data, isEditMode, onElementClick, onElementDrag}) => {
    const {id, position, icon, area} = element;
    const {shadowPoints, shadowMaskPoints, bulbsLinePoints} = area || {};
    const {state, substate} = data || {};

    const rootClassName = cx({
        'group--edit': isEditMode,
    });

    return (
        <g className={rootClassName}>
            {shadowPoints && <Shadow id={id} points={shadowPoints} maskPoints={shadowMaskPoints} state={state} />}
            {bulbsLinePoints && <BulbsLine points={bulbsLinePoints} state={state} />}
            <ElementComponent
                position={position}
                icon={icon}
                state={state}
                substate={substate}
                isEditMode={isEditMode}
                onClick={onElementClick}
                onDrag={onElementDrag}
            />
        </g>
    )
}

export default ElementGroup;
