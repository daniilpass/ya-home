import type {
    CSSProperties,
    FC,
    SyntheticEvent
} from 'react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import cx from 'classnames';

import type { Plan, PlanDevice, Point } from '@homemap/shared';

import type { Element } from '../../services/mapService/model/Element';
import { useDispatch } from '../../store/hooks';

import { useResize } from './hooks/useResize';
import ElementGroup from './components/ElementGroup';
import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';
import type { DragEvent } from './hooks/useDrag';
import { normilizePosition } from './tools';
import { Canvas } from './canvasRenderer';

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
    elements?: Plan['devices'];
    editableElement?: PlanDevice;
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
    onElementDragEnd?: (id: string, position: Point) => void;
    onBulbsLinePointDrag?: (id: string, index: number, position: Point) => void;
    onBulbsLinePointDragEnd?: (id: string, index: number, position: Point) => void;
    onShadowPointDrag?: (id: string, index: number, position: Point) => void;
    onShadowPointDragEnd?: (id: string, index: number, position: Point) => void;
    onShadowMaskPointDrag?: (id: string, index: number, position: Point) => void;
    onShadowMaskPointDragEnd?: (id: string, index: number, position: Point) => void;
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
    editableElement,
    editElementDrag = false,
    isEditorMode,
    onElementClick,
    onElementDrag,
    onElementDragEnd,
    onBulbsLinePointDrag,
    onBulbsLinePointDragEnd,
    onShadowPointDrag,
    onShadowPointDragEnd,
    onShadowMaskPointDrag,
    onShadowMaskPointDragEnd,
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
    const isBackgroundReadyRef = useRef<boolean>(false);
    const [isBackgroundError, setIsBackgroundError] = useState<boolean>(false);
    const [scale, rotate, translate] = useResize(
        wrapperRef,
        svgRef,
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

    useEffect(() => onReady?.(), [])

    const handleBackgroundReady = useCallback(() => {
        if (isBackgroundReadyRef.current) {
            return;
        }

        isBackgroundReadyRef.current = true;
        onReady?.();
    }, [isBackgroundReadyRef, onReady]);

    // No image - auto ready
    useEffect(() => {
        if (!background.image) {
            handleBackgroundReady();
        }
    }, [background.image, handleBackgroundReady]);

    // Reset error state after image changed
    useEffect(() => {

        if (isBackgroundReadyRef.current) {
            setIsBackgroundError(false);
        }
    }, [background.image]);

    useEffect(() => {
        if (!svgRef.current || !onTansform) {
            return;
        }
        onTansform({ scale, rotate, translate, bounds: svgRef.current.getBoundingClientRect() });
    }, [scale, rotate, translate, svgRef, onTansform]);

    const handleBackgroundLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        onBackgroundLoad?.(e);
        handleBackgroundReady();
    };

    const handleBackgroundError = (e: SyntheticEvent<HTMLImageElement>) => {
        dispatch.alerts.error('Ошибка загрузки фона');
        setIsBackgroundError(true);
        onBackgroundError?.(e);
        handleBackgroundReady();
    };

    const handleElementClick = useCallback((id: string) => {
        onElementClick?.(id);
    }, [onElementClick]);

    const handleElementDrag = useCallback((id: string, { pageXDiff, pageYDiff }: DragEvent) => {
        if (!onElementDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onElementDrag(id, position);
    }, [onElementDrag, scale]);

    const handleElementDragEnd = useCallback((id: string, { pageXDiff, pageYDiff }: DragEvent) => {
        if (!onElementDragEnd) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onElementDragEnd(id, position);
    }, [onElementDragEnd, scale]);

    const handleBulbsLinePointDrag = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onBulbsLinePointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onBulbsLinePointDrag(id, index, position);
    }, [onBulbsLinePointDrag, scale]);

    const handleBulbsLinePointDragEnd = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onBulbsLinePointDragEnd) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onBulbsLinePointDragEnd(id, index, position);
    }, [onBulbsLinePointDragEnd, scale]);

    const handleShadowPointDrag = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowPointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowPointDrag(id, index, position);
    }, [onShadowPointDrag, scale]);

    const handleShadowPointDragEnd = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowPointDragEnd) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowPointDragEnd(id, index, position);
    }, [onShadowPointDragEnd, scale]);

    const handleShadowMaskPointDrag = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowMaskPointDrag) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowMaskPointDrag(id, index, position);
    }, [onShadowMaskPointDrag, scale]);

    const handleShadowMaskPointDragEnd = useCallback((id: string, index: number, { pageXDiff, pageYDiff, }: DragEvent) => {
        if (!onShadowMaskPointDragEnd) {
            return;
        }
        const position = normilizePosition(pageXDiff, pageYDiff, scale);
        onShadowMaskPointDragEnd(id, index, position);
    }, [onShadowMaskPointDragEnd, scale]);

    const editableElementId = editableElement?.id;

    const sortedElements = useMemo(() => {
        const elementsEntries = Object.entries(elements);
    
        // TODO: implement z-index for plan devices
        // First render elements with shadow
        elementsEntries.sort((a, b) => {
            const aDevice = a[1];
            const bDevice = b[1];
            if (aDevice.area?.shadowPoints && bDevice.area?.shadowPoints) {
                return 0;
            } else if (aDevice.area?.shadowPoints) {
                return -1;
            } else {
                return 1;
            }
        });

        // In edit mode, hide the edit element.
        if (editableElementId) {
            const editElementIndex = elementsEntries.findIndex(([id]) => id === editableElementId);
            elementsEntries.splice(editElementIndex, 1);
            // elementsEntries.push([editableElementId, elements[editableElementId]]);
        }
        
        return elementsEntries;
    }, [elements, editableElementId]);

    const wrapperStyle: CSSProperties = {
        // backgroundColor: background.color,
        ...styles?.wrapper,
    };

    const layoutStyle: CSSProperties = {
        // backgroundColor: background.color,
        transform: `scale(${scale}) rotate(${rotate}deg) translate(${translate[0]}px, ${translate[1]}px)`,
        width: width,
        height: height,
        flexShrink: 0,
        overflow: 'hidden',
    };

    const wrapperClassName = cx('map-wrapper', classes?.wrapper);

    const layoutClassName = cx({
        'map-layout--transitional': transition && !allowDrag && !allowZoom,
    }, classes?.layout);


    // const sortedElemensDOM = useMemo(() => sortedElements.map(([id, element]) => (
    //     <ElementGroup
    //         key={id}
    //         element={element}
    //         data={data?.[id]}
    //         isEditMode={id === editableElementId}
    //         selectable={isEditorMode}
    //         onElementClick={handleElementClick}
    //         onElementDrag={handleElementDrag}
    //         onElementDragEnd={handleElementDragEnd}
    //         onBulbsLinePointDrag={handleBulbsLinePointDrag}
    //         onShadowPointDrag={handleShadowPointDrag}
    //         onShadowMaskPointDrag={handleShadowMaskPointDrag}
    //     />
    // )), [
    //     data, editableElementId, isEditorMode, sortedElements,
    //     handleBulbsLinePointDrag,
    //     handleElementClick,
    //     handleElementDrag,
    //     handleElementDragEnd,
    //     handleShadowMaskPointDrag,
    //     handleShadowPointDrag, 
    // ])

    return (
        <TransformContextProvider value={{ scale, rotate, editElementDrag }}>
            <div className={wrapperClassName} style={wrapperStyle} ref={wrapperRef}>
                <div className={layoutClassName} style={layoutStyle} ref={layoutRef}>
                    <Canvas background={background} width={width} height={height} elements={elements} />

                    {/* Background image */}
                    {/* {!isBackgroundError && background.image && (
                        <img
                            src={background.image}
                            onLoad={handleBackgroundLoad}
                            onError={handleBackgroundError}
                        ></img>
                    )} */}

                    {/* Background image fallback*/}
                    {/* {isBackgroundError && (
                        <div className="map-layout__image-fallback"></div>
                    )} */}

                    {/* Map */}
                    <svg className="map-layout__svg" ref={svgRef}>
                        {/* {sortedElemensDOM} */}
                        {editableElement && (
                            <ElementGroup
                                key={editableElement.id}
                                element={editableElement}
                                data={data?.[editableElement.id]}
                                isEditMode={true}
                                onElementClick={handleElementClick}
                                onElementDrag={handleElementDrag}
                                onElementDragEnd={handleElementDragEnd}
                                onBulbsLinePointDrag={handleBulbsLinePointDrag}
                                onBulbsLinePointDragEnd={handleBulbsLinePointDragEnd}
                                onShadowPointDrag={handleShadowPointDrag}
                                onShadowPointDragEnd={handleShadowPointDragEnd}
                                onShadowMaskPointDrag={handleShadowMaskPointDrag}
                                onShadowMaskPointDragEnd={handleShadowMaskPointDragEnd}
                            />
                        )}
                    </svg>
                </div>
            </div>
        </TransformContextProvider>
    );
};

export default HomeMap;
