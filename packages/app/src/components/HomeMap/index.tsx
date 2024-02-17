import {CSSProperties, FC, SyntheticEvent, useEffect, useMemo, useRef, useState} from 'react';
import cx from 'classnames';

import { Plan, PlanDevice } from '@homemap/shared';
import { Element } from '../../services/mapService/model/Element';
import { useResize } from './hooks/useResize';
import ElementGroup from './components/ElementGroup';
import { useDispatch } from '../../store/hooks';

import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';
export type MapTransform = {
    scale: number;
    rotate: number;
    translate: [number, number];
    bounds: DOMRect;
}

export type Props = {
    background: Plan['background'];
    width: Plan['width'];
    height: Plan['height'];
    elements?: Record<string, PlanDevice>;
    editElementId?: string;
    editElementDrag?: boolean;
    isEditorMode?: boolean;
    data?: Record<string, Element>;
    allowScale?: boolean;
    allowInitialScale?: boolean;
    allowRotate?: boolean;
    allowInitialRotate?: boolean;
    allowZoom?: boolean;
    allowDrag?: boolean;
    transition?: boolean;
    onElementClick?: (id: string) => void;
    onElementDrag?: (id: string, x: number, y: number) => void;
    onBulbsLinePointDrag?: (id: string, index: number, x: number, y: number) => void;
    onShadowPointDrag?: (id: string, index: number, x: number, y: number) => void;
    onShadowMaskPointDrag?: (id: string, index: number, x: number, y: number) => void;
    onTansform?: (transfrom: MapTransform) => void;
    onReady?: () => void;
    onBackgroundLoad?: (e: SyntheticEvent<HTMLImageElement>) => void;
    onBackgroundError?: (e: SyntheticEvent<HTMLImageElement>) => void;
    classes?: {
        wrapper?: string,
        layout?: string,
    },
    styles?: {
        wrapper: CSSProperties
    }
}

const HomeMap: FC<Props> = ({
    background,
    width,
    height,
    elements = {},
    data,
    allowScale,
    allowInitialScale,
    allowRotate,
    allowInitialRotate,
    allowZoom,
    allowDrag,
    transition,
    editElementId,
    editElementDrag = false,
    isEditorMode,
    onElementClick,
    onElementDrag,
    onBulbsLinePointDrag,
    onShadowPointDrag,
    onShadowMaskPointDrag,
    onTansform,
    onReady,
    onBackgroundLoad,
    onBackgroundError,
    classes,
    styles,
}) => {
    const dispatch = useDispatch();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [isBackgrounError, setIsBackgrounError] = useState<boolean>(false);
    const [scale, rotate, translate] = useResize(
        wrapperRef,
        layoutRef,
        {
            allowScale,
            allowInitialScale,
            allowRotate,
            allowInitialRotate,
            allowZoom,
            allowDrag,
            naturalWidth: width,
            naturalHeight: height,
        });

    useEffect(() => {
        if (!svgRef.current || !onTansform) {
            return;
        }
        onTansform({scale, rotate, translate, bounds: svgRef.current.getBoundingClientRect()})
    }, [scale, rotate, translate, svgRef, onTansform]);

    const handleBackgroundLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        onBackgroundLoad?.(e);
        onReady?.();
    }

    const handleBackgroundError = (e: SyntheticEvent<HTMLImageElement>) => {
        dispatch.alerts.error('Ошибка загрузки фона');
        setIsBackgrounError(true);
        onBackgroundError?.(e);
        onReady?.();
    }

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

    const wrapperStyle: CSSProperties = {
        backgroundColor: background.color,
        ...styles?.wrapper,
    }

    const layoutStyle: CSSProperties = {
        backgroundColor: background.color,
        transform: `scale(${scale}) rotate(${rotate}deg) translate(${translate[0]}px, ${translate[1]}px)`,
        width: width,
        height: height,
        flexShrink: 0,
        overflow: 'hidden',
    }

    const wrapperClassName = cx('map-wrapper', classes?.wrapper);

    const layoutClassName = cx({
        'map-layout--transitional': transition && !allowDrag && !allowZoom,
    }, classes?.layout);

    return (
        <TransformContextProvider value={{scale, rotate, editElementDrag}}>
            <div className={wrapperClassName} style={wrapperStyle} ref={wrapperRef}>
                <div className={layoutClassName} style={layoutStyle} ref={layoutRef}>
                    {!isBackgrounError ? (
                        <img
                            src={background.image}
                            onLoad={handleBackgroundLoad}
                            onError={handleBackgroundError}
                        ></img>
                    ) : (
                        <div className="map-layout__image-fallback"></div>
                    )}
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
