import React, {FC, useRef} from 'react';
import {Element as MapElement} from '../../services/mapService/model/Element';
import {Element as ConfigurationElement} from '../../services/configurationService/model/Element';

import {useResize} from './hooks/useResize';
import ElementGroup from './components/ElementGroup';

import TransformContextProvider from './providers/TransformContextProvider';
import './style.css';

export type Props = {
    imageSrc: string;
    elements: Record<string, ConfigurationElement>;
    data?: Record<string, MapElement>;
    onElementClick?: (id: string) => void;
}

const HomeMap: FC<Props> = ({imageSrc, elements, data, onElementClick}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [scale, rotateDegree] = useResize(wrapperRef, imageRef);

    const imageStyle = {
        transform: `scale(${scale}) rotate(${rotateDegree}deg)`,
    };

    const handleElementClick = (id: string) => {
        onElementClick && onElementClick(id);
    }

    return (
        <TransformContextProvider value={{scale, rotateDegree}}>
            <div className="map-wrapper" ref={wrapperRef}>
                <div className="map-layout" style={imageStyle}>
                    <img className="map-layout__image" src={imageSrc} ref={imageRef}></img>
                    <svg className="map-layout__svg">
                        {
                            Object.entries(elements).map(([id, element]) => {
                                return <ElementGroup
                                    key={id}
                                    element={element}
                                    data={data?.[id]}
                                    onElementClick={() => handleElementClick(id)}
                                />
                            })
                        }
                    </svg>
                </div>
            </div>
        </TransformContextProvider>
        
    )
}

export default HomeMap;