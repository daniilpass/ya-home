import {FC} from 'react';

import {Element} from '../../../../services/configurationService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';

type Props = {
    element: Element
}

const ElementGroup: FC<Props> = ({element}) => {
    const {
        position,
        icon,
    } = element;
    const {
        shadowPoints,
        bulbsLinePoints,
    } = element.area || {};

    return (
        <g>
            {shadowPoints && <Shadow points={shadowPoints}/>}
            {bulbsLinePoints && <BulbsLine points={bulbsLinePoints}/>}
            <ElementComponent position={position} icon={icon} />
        </g>
    )
}

export default ElementGroup;
