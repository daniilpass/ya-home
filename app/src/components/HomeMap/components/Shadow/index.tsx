import {FC} from 'react';

import {Point} from '../../../../services/configurationService/model/Area';
import {State} from '../../../../services/mapService/model/State';
import {useDrag} from '../../hooks/useDrage';
import {EditActionMove} from '../EditAction';

import './styles.css';

type Props = {
    id: string;
    points: Point[];
    maskPoints?: Point[];
    state?: string;
    isEditMode?: boolean;
    onPointDrag?: (index: number, pageX: number, pageY: number) => void;
}

const Shadow: FC<Props> = ({id, points, maskPoints, state, isEditMode, onPointDrag}) => {
    const onDrag = (pageX: number, pageY: number, options: any) => {
        const {index} = options;
        onPointDrag && onPointDrag(index, pageX, pageY);
    }

    const onDragStart = useDrag(onDrag);

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
            {isEditMode && points.map(([x, y], index) => (
                <EditActionMove
                    key={index}
                    x={x}
                    y={y}
                    onMouseDown={(e) => onDragStart(e, {index})}
                />
            ))}
        </>
    )
}

export default Shadow;
