import React, {FC, useMemo, useRef} from 'react';
import {Element as MapElement} from '../../services/mapService/model/Element';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';

import {useResize} from './hooks/useResize';
import ElementGroup from './components/ElementGroup';

import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';

export type Props = {
    imageSrc: string;
    elements: Record<string, ConfigurationElement>;
    editElementId?: string;
    isEditorMode?: boolean;
    data?: Record<string, MapElement>;
    allowScale?: boolean;
    allowRotate?: boolean;
    onElementClick?: (id: string) => void;
    onElementDrag?: (id: string, pageX: number, pageY: number) => void;
}

const HomeMap: FC<Props> = ({imageSrc, elements, data, allowScale, allowRotate, editElementId, onElementClick, onElementDrag}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [scale, rotateDegree] = useResize(wrapperRef, imageRef, {allowScale, allowRotate});

    const imageStyle = {
        transform: `scale(${scale}) rotate(${rotateDegree}deg)`,
    };

    const handleElementClick = (id: string) => {
        onElementClick && onElementClick(id);
    }

    const handleElementDrag = (id: string, pageX: number, pageY: number) => {
        if (!onElementDrag || !svgRef.current) {
            return;
        }
        const bounds = svgRef.current.getBoundingClientRect();
        const x = (pageX - bounds.left) / scale;
        const y = (pageY - bounds.top) / scale;
        onElementDrag(id, x, y);
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

    return (
        <TransformContextProvider value={{scale, rotateDegree}}>
            <div className="map-wrapper" ref={wrapperRef}>
                <div className="map-layout" style={imageStyle}>
                    <img className="map-layout__image" src={imageSrc} ref={imageRef}></img>
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