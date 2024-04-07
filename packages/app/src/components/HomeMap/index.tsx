import {
    CSSProperties,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cx from 'classnames';

import { Plan, PlanDevice, Point } from '@homemap/shared';
import { Element } from '../../services/mapService/model/Element';
import { useResize } from './hooks/useResize';
import ElementGroup from './components/ElementGroup';
import { useDispatch } from '../../store/hooks';

import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';
import { DragEvent } from './hooks/useDrag';
import { normilizePosition } from './tools';
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
    onElementDrag?: (id: string, position: Point) => void;
    onBulbsLinePointDrag?: (id: string, index: number, position: Point) => void;
    onShadowPointDrag?: (id: string, index: number, position: Point) => void;
    onShadowMaskPointDrag?: (id: string, index: number, position: Point) => void;
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
    const isReadyRef = useRef<boolean>(false);
    const [isBackgroundError, setIsBackgroundError] = useState<boolean>(false);
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

    const handleReady = useCallback(() => {
        if (!isReadyRef.current) {
            isReadyRef.current = true;
            onReady?.();
        }
    }, [isReadyRef, onReady]);

    useEffect(() => {
        if (!background.image) {
            handleReady();
        }
    }, [background.image, handleReady]);

    useEffect(() => {
        if (!svgRef.current || !onTansform) {
            return;
        }
        onTansform({scale, rotate, translate, bounds: svgRef.current.getBoundingClientRect()})
    }, [scale, rotate, translate, svgRef, onTansform]);

    const handleBackgroundLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        onBackgroundLoad?.(e);
        handleReady();
    }

    const handleBackgroundError = (e: SyntheticEvent<HTMLImageElement>) => {
        dispatch.alerts.error('Ошибка загрузки фона');
        setIsBackgroundError(true);
        onBackgroundError?.(e);
        handleReady();
    }

    const handleElementClick = (id: string) => {
        onElementClick && onElementClick(id);
    }

    const handleElementDrag = (id: string, { pageXDiff, pageYDiff }: DragEvent) => {
        if (!onElementDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onElementDrag(id, position);
    }

    const handleBulbsLinePointDrag = (id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onBulbsLinePointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onBulbsLinePointDrag(id, index, position);
    }

    const handleShadowPointDrag = (id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowPointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowPointDrag(id, index, position);
    }

    const handleShadowMaskPointDrag = (id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowMaskPointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowMaskPointDrag(id, index, position);
    }

    const sortedElements = useMemo(() => {
        const elementsEntries = Object.entries(elements)
    
        // TODO: implement z-index for plan devices
        // First render elements with shadow
        elementsEntries.sort((a, b) => {
            const aDevice = a[1];
            const bDevice = b[1];
            if (aDevice.area?.shadowPoints && bDevice.area?.shadowPoints) {
                return 0
            } else if (aDevice.area?.shadowPoints) {
                return -1;
            } else {
                return 1;
            }
        })

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
                    {/* Background image */}
                    {!isBackgroundError && background.image && (
                        <img
                            src={background.image}
                            onLoad={handleBackgroundLoad}
                            onError={handleBackgroundError}
                        ></img>
                    )}

                    {/* Background image fallback*/}
                    {isBackgroundError && (
                        <div className="map-layout__image-fallback"></div>
                    )}

                    {/* Map */}
                    <svg className="map-layout__svg" ref={svgRef}>
                        {
                            sortedElements.map(([id, element]) => (
                                <ElementGroup
                                    key={id}
                                    element={element}
                                    data={data?.[id]}
                                    isEditMode={id === editElementId}
                                    onElementClick={() => handleElementClick(id)}
                                    onElementDrag={(event) => handleElementDrag(id, event)}
                                    onBulbsLinePointDrag={(index, event) => handleBulbsLinePointDrag(id, index, event)}
                                    onShadowPointDrag={(index, event) => handleShadowPointDrag(id, index, event)}
                                    onShadowMaskPointDrag={(index, event) => handleShadowMaskPointDrag(id, index, event)}
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
