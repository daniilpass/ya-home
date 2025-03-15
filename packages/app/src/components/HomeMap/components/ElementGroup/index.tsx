import {FC, useCallback} from 'react';
import cx from 'classnames';

import { PlanDevice, DeviceIconType } from '@homemap/shared';

import { Element } from '../../../../services/mapService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';
import { DragEvent } from '../../hooks/useDrag';

import './style.scss';

type Props = {
    element: PlanDevice;
    data?: Element;
    isEditMode?: boolean;
    selectable?: boolean;
    onElementClick?: (id: Element['id']) => void;
    onElementDrag?: (id: Element['id'], event: DragEvent) => void;
    onBulbsLinePointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowPointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowMaskPointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
}

const ElementGroup: FC<Props> = ({
    element,
    data,
    isEditMode,
    selectable,
    onElementClick,
    onElementDrag,
    onBulbsLinePointDrag,
    onShadowPointDrag,
    onShadowMaskPointDrag,
}) => {
    console.log('HELLO ElementGroup')
    const {id, type, position, icon, area} = element;
    const {shadowPoints, shadowMaskPoints, bulbsLinePoints} = area || {};
    const {state, substate} = data || {};

    const rootClassName = cx({
        'group--edit': isEditMode,
    });

    const handleShadowPointDrag = useCallback((index: number, event: DragEvent) => {
        onShadowPointDrag?.(element.id, index, event);
    }, [element.id, onShadowPointDrag]);

    const handleShadowMaskPointDrag= useCallback((index: number, event: DragEvent) => {
        onShadowMaskPointDrag?.(element.id, index, event);
    }, [element.id, onShadowMaskPointDrag]);

    const handleBulbsLinePointDrag = useCallback((index: number, event: DragEvent) => {
        onBulbsLinePointDrag?.(element.id, index, event);
    }, [element.id, onBulbsLinePointDrag]);

    const handleElementClick = useCallback(() => {
        onElementClick?.(element.id);
    }, [element.id, onElementClick]);

    const handleElementDrag = useCallback((event: DragEvent) => {
        onElementDrag?.(element.id, event);
    }, [element.id, onElementDrag]);

    return (
        <g className={rootClassName}>
            {shadowPoints && (
                <Shadow
                    id={id}
                    points={shadowPoints}
                    maskPoints={shadowMaskPoints}
                    state={state}
                    isEditMode={isEditMode}
                    onPointDrag={handleShadowPointDrag}
                    onMaskPointDrag={handleShadowMaskPointDrag}
                />
            )}
            {bulbsLinePoints && (
                <BulbsLine
                    points={bulbsLinePoints}
                    state={state}
                    substate={substate}
                    isEditMode={isEditMode}
                    onPointDrag={handleBulbsLinePointDrag}
                />
            )}
            <ElementComponent
                type={type}
                position={position}
                icon={icon as DeviceIconType}
                state={state}
                substate={substate}
                isEditMode={isEditMode}
                selectable={selectable}
                onClick={handleElementClick}
                onDrag={handleElementDrag}
            />
        </g>
    )
}

export default ElementGroup;
