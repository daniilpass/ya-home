import type { FC } from 'react';
import { useCallback } from 'react';

import cx from 'classnames';

import type { PlanDevice, DeviceIconType } from '@homemap/shared';

import type { Element } from '../../../../services/mapService/model/Element';
import Shadow from '../Shadow';
import BulbsLine from '../BulbsLine';
import ElementComponent from '../Element';
import type { DragEvent } from '../../hooks/useDrag';

import './style.css';

type Props = {
    element: PlanDevice;
    data?: Element;
    isEditMode?: boolean;
    selectable?: boolean;
    onElementClick?: (id: Element['id']) => void;
    onElementDrag?: (id: Element['id'], event: DragEvent) => void;
    onElementDragEnd?: (id: Element['id'], event: DragEvent) => void;
    onBulbsLinePointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
    onBulbsLinePointDragEnd?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowPointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowPointDragEnd?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowMaskPointDrag?: (id: Element['id'], index: number, event: DragEvent) => void;
    onShadowMaskPointDragEnd?: (id: Element['id'], index: number, event: DragEvent) => void;
}

const ElementGroup: FC<Props> = ({
    element,
    data,
    isEditMode,
    selectable,
    onElementClick,
    onElementDrag,
    onElementDragEnd,
    onBulbsLinePointDrag,
    onBulbsLinePointDragEnd,
    onShadowPointDrag,
    onShadowPointDragEnd,
    onShadowMaskPointDrag,
    onShadowMaskPointDragEnd,
}) => {
    const { id, type, position, icon, area, orientation } = element;
    const { shadowPoints, shadowMaskPoints, bulbsLinePoints } = area || {};
    const { state, substate } = data || {};

    const rootClassName = cx({
        'group--edit': isEditMode,
    });

    const handleShadowPointDrag = useCallback((index: number, event: DragEvent) => {
        onShadowPointDrag?.(element.id, index, event);
    }, [element.id, onShadowPointDrag]);

    const handleShadowPointDragEnd = useCallback((index: number, event: DragEvent) => {
        onShadowPointDragEnd?.(element.id, index, event);
    }, [element.id, onShadowPointDragEnd]);

    const handleShadowMaskPointDrag = useCallback((index: number, event: DragEvent) => {
        onShadowMaskPointDrag?.(element.id, index, event);
    }, [element.id, onShadowMaskPointDrag]);

    const handleShadowMaskPointDragEnd = useCallback((index: number, event: DragEvent) => {
        onShadowMaskPointDragEnd?.(element.id, index, event);
    }, [element.id, onShadowMaskPointDragEnd]);

    const handleBulbsLinePointDrag = useCallback((index: number, event: DragEvent) => {
        onBulbsLinePointDrag?.(element.id, index, event);
    }, [element.id, onBulbsLinePointDrag]);

    const handleBulbsLinePointDragEnd = useCallback((index: number, event: DragEvent) => {
        onBulbsLinePointDragEnd?.(element.id, index, event);
    }, [element.id, onBulbsLinePointDragEnd]);

    const handleElementClick = useCallback(() => {
        onElementClick?.(element.id);
    }, [element.id, onElementClick]);

    const handleElementDrag = useCallback((event: DragEvent) => {
        onElementDrag?.(element.id, event);
    }, [element.id, onElementDrag]);

    const handleElementDragEnd = useCallback((event: DragEvent) => {
        onElementDragEnd?.(element.id, event);
    }, [element.id, onElementDragEnd]);

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
                    onPointDragEnd={handleShadowPointDragEnd}
                    onMaskPointDrag={handleShadowMaskPointDrag}
                    onMaskPointDragEnd={handleShadowMaskPointDragEnd}
                />
            )}
            {bulbsLinePoints && (
                <BulbsLine
                    points={bulbsLinePoints}
                    state={state}
                    substate={substate}
                    isEditMode={isEditMode}
                    onPointDrag={handleBulbsLinePointDrag}
                    onPointDragEnd={handleBulbsLinePointDragEnd}
                />
            )}
            <ElementComponent
                type={type}
                position={position}
                orientation={orientation}
                icon={icon as DeviceIconType}
                state={state}
                substate={substate}
                isEditMode={isEditMode}
                selectable={selectable}
                onClick={handleElementClick}
                onDrag={handleElementDrag}
                onDragEnd={handleElementDragEnd}
            />
        </g>
    );
};

export default ElementGroup;
