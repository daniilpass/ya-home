import {FC} from 'react';

import {Element} from '../../../../services/configurationService/model/Element';
import {Element as MapElement} from '../../../../services/mapService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';

type Props = {
    element: Element;
    data?: MapElement;
}

const ElementGroup: FC<Props> = ({element, data}) => {
    const {position, icon, area} = element;
    const {shadowPoints, bulbsLinePoints} = area || {};
    const {state, substate} = data || {};
    return (
        <g>
            {shadowPoints && <Shadow points={shadowPoints} state={state} />}
            {bulbsLinePoints && <BulbsLine points={bulbsLinePoints} state={state} />}
            <ElementComponent
                position={position}
                icon={icon}
                state={state}
                substate={substate}
            />
        </g>
    )
}

export default ElementGroup;
