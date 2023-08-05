import {FC} from 'react';

import {Point} from '../../../../services/configurationService/model/Area';
import {State} from '../../../../services/mapService/model/State';

import './styles.css';

type Props = {
    id: string;
    points: Point[];
    maskPoints?: Point[];
    state?: string;
}

const Shadow: FC<Props> = ({id, points, maskPoints, state}) => {
    if (state === State.On) {
        return null;
    }

    const svgShadowPoints = points.flat().join(',');
    const svgMaskPoints = maskPoints?.flat().join(',');
    const maskId = `shadow-mask-${id}`;
    const mask =  svgMaskPoints && `url(#${maskId})`;

    return (
        <>
            <polygon className='element-shadow' points={svgShadowPoints} mask={mask} />
            {svgMaskPoints && (
                <mask id={maskId}>
                    <polygon points={svgShadowPoints} fill='white' />
                    <polygon points={svgMaskPoints} fill='black' />
                </mask>
            )}
        </>
    )
}

export default Shadow;
