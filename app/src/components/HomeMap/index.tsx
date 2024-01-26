import React, {CSSProperties, FC, useMemo, useRef} from 'react';
import cx from 'classnames';

import {Element as MapElement} from '../../services/mapService/model/Element';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';
import {Plan} from '../../services/configurationService/model/Plan';

import {useResize} from './hooks/useResize';
import ElementGroup from './components/ElementGroup';

import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';

export type Props = {
    plan: Plan;
    elements: Record<string, ConfigurationElement>;
    editElementId?: string;
    isEditorMode?: boolean;
    data?: Record<string, MapElement>;
    allowScale?: boolean;
    allowInitialScale?: boolean;
    allowRotate?: boolean;
    allowInitialRotate?: boolean;
    allowZoom?: boolean;
    allowDrag?: boolean;
    onElementClick?: (id: string) => void;
    onElementDrag?: (id: string, x: number, y: number) => void;
    onBulbsLinePointDrag?: (id: string, index: number, x: number, y: number) => void;
    onShadowPointDrag?: (id: string, index: number, x: number, y: number) => void;
    onShadowMaskPointDrag?: (id: string, index: number, x: number, y: number) => void;
    classes?: {
        wrapper?: string,
        layout?: string,
    },
    styles?: {
        wrapper: CSSProperties
    }
}

const HomeMap: FC<Props> = ({
    plan,
    elements,
    data,
    allowScale,
    allowInitialScale,
    allowRotate,
    allowInitialRotate,
    allowZoom,
    allowDrag,
    editElementId,
    isEditorMode,
    onElementClick,
    onElementDrag,
    onBulbsLinePointDrag,
    onShadowPointDrag,
    onShadowMaskPointDrag,
    classes,
    styles,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [scale, rotateDegree, translate] = useResize(
        wrapperRef,
        layoutRef,
        {
            allowScale,
            allowInitialScale,
            allowRotate,
            allowInitialRotate,
            allowZoom,
            allowDrag,
            naturalWidth: plan.width,
            naturalHeight: plan.height,
        });

    const handleElementClick = (id: string) => {
        onElementClick && onElementClick(id);
    }

    const toRelativePosition = (pageX: number, pageY: number) => {
        if (!svgRef.current) {
            return {x: pageX, y: pageY};
        }
        const bounds = svgRef.current.getBoundingClientRect();
        return {
            x: (pageX - bounds.left) / scale,
            y: (pageY - bounds.top) / scale,
        }
    }

    const handleElementDrag = (id: string, pageX: number, pageY: number) => {
        if (!onElementDrag) {
            return;
        }
        const {x, y} = toRelativePosition(pageX, pageY);
        onElementDrag(id, x, y);
    }

    const handleBulbsLinePointDrag = (id: string, index: number, pageX: number, pageY: number) => {
        if (!onBulbsLinePointDrag) {
            return;
        }
        const {x, y} = toRelativePosition(pageX, pageY);
        onBulbsLinePointDrag(id, index, x, y);
    }

    const handleShadowPointDrag = (id: string, index: number, pageX: number, pageY: number) => {
        if (!onShadowPointDrag) {
            return;
        }
        const {x, y} = toRelativePosition(pageX, pageY);
        onShadowPointDrag(id, index, x, y);
    }

    const handleShadowMaskPointDrag = (id: string, index: number, pageX: number, pageY: number) => {
        if (!onShadowMaskPointDrag) {
            return;
        }
        const {x, y} = toRelativePosition(pageX, pageY);
        onShadowMaskPointDrag(id, index, x, y);
    }

    const sortedElements = useMemo(() => {
        const elementsEntries = Object.entries(elements)
    
        // In edit mode, bring the edit element to the top.
        if (editElementId) {
            const editElementIndex = elementsEntries.findIndex(([id]) => id === editElementId);
            elementsEntries.splice(editElementIndex, 1);
            elementsEntries.push([editElementId, elements[editElementId]]);
        }
        
        return elementsEntries;
    }, [elements, editElementId]);

    const wrapperStyle = {
        backgroundColor: plan.background.color,
        ...styles?.wrapper,
    }

    const layoutStyle = {
        backgroundColor: plan.background.color,
        transform: `scale(${scale}) rotate(${rotateDegree}deg) translate(${translate[0]}px, ${translate[1]}px)`,
    }

    const wrapperClassName = cx('map-wrapper', classes?.wrapper);

    const layoutClassName = cx({
        'map-layout--transitional': !allowDrag && !allowZoom,
    }, classes?.layout);

    return (
        <TransformContextProvider value={{scale, rotateDegree}}>
            <div className={wrapperClassName} style={wrapperStyle} ref={wrapperRef}>
                <div className={layoutClassName} style={layoutStyle} ref={layoutRef}>
                    <img className="map-layout__image" src={plan.background.src}></img>
                    <svg className="map-layout__svg" ref={svgRef}>
                        {
                            sortedElements.map(([id, element]) => (
                                <ElementGroup
                                    key={id}
                                    element={element}
                                    data={data?.[id]}
                                    isEditMode={id === editElementId}
                                    onElementClick={() => handleElementClick(id)}
                                    onElementDrag={(pageX, pageY) => handleElementDrag(id, pageX, pageY)}
                                    onBulbsLinePointDrag={(index, pageX, pageY) => handleBulbsLinePointDrag(id, index, pageX, pageY)}
                                    onShadowPointDrag={(index, pageX, pageY) => handleShadowPointDrag(id, index, pageX, pageY)}
                                    onShadowMaskPointDrag={(index, pageX, pageY) => handleShadowMaskPointDrag(id, index, pageX, pageY)}
                                />
                            ))
                        }
                    </svg>
                </div>
            </div>
        </TransformContextProvider>
        
    )
}

export default HomeMap;
