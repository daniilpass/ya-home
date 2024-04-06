import {FC} from 'react';
import cx from 'classnames';

import { PlanDevice } from '@homemap/shared';

import { Element } from '../../../../services/mapService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';
import { DeviceIconName } from '../../../DeviceIcon';

import './style.scss';

type Props = {
    element: PlanDevice;
    data?: Element;
    isEditMode?: boolean;
    onElementClick?: () => void;
    onElementDrag?: (pageX:number, pageY: number) => void;
    onBulbsLinePointDrag?: (index: number, pageX: number, pageY: number) => void;
    onShadowPointDrag?: (index: number, pageX: number, pageY: number) => void;
    onShadowMaskPointDrag?: (index: number, pageX: number, pageY: number) => void;
}

const ElementGroup: FC<Props> = ({
    element,
    data,
    isEditMode,
    onElementClick,
    onElementDrag,
    onBulbsLinePointDrag,
    onShadowPointDrag,
    onShadowMaskPointDrag,
}) => {
    const {id, type, position, icon, area} = element;
    const {shadowPoints, shadowMaskPoints, bulbsLinePoints} = area || {};
    const {state, substate} = data || {};

    const rootClassName = cx({
        'group--edit': isEditMode,
    });

    return (
        <g className={rootClassName}>
            {shadowPoints && (
                <Shadow
                    id={id}
                    points={shadowPoints}
                    maskPoints={shadowMaskPoints}
                    state={state}
                    isEditMode={isEditMode}
                    onPointDrag={onShadowPointDrag}
                    onMaskPointDrag={onShadowMaskPointDrag}
                />
            )}
            {bulbsLinePoints && (
                <BulbsLine
                    points={bulbsLinePoints}
                    state={state}
                    substate={substate}
                    isEditMode={isEditMode}
                    onPointDrag={onBulbsLinePointDrag}
                />
            )}
            <ElementComponent
                type={type}
                position={position}
                icon={icon as DeviceIconName}
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
