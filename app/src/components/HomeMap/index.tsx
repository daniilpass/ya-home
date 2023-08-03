import React, {FC, useLayoutEffect, useRef, useState} from 'react';
import {Element} from '../../services/mapService/model/Element';

import {useResize} from './hooks/useResize';
import './style.css';


export type Props = {
    mapSrc: string;
    elements: Record<string, Element>;
}

// Object.entries(this.elements).forEach(([entityId, entity]) => {
//     svgMap.appendChild(this.createGroup(svgMap, entity));
// });

const HomeMap: FC<Props> = ({mapSrc, elements}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageScale = useResize(wrapperRef, imageRef);

    const imageStyle = {
        transform: `scale(${imageScale})`,
    };

    return (
        <div className="map-wrapper" ref={wrapperRef}>
            <div className="map-layout" style={imageStyle}>
                <img className="map-layout__image" src={mapSrc} ref={imageRef}></img>
                <svg className="map-layout__svg"></svg>
            </div>
        </div>
    )
}

export default HomeMap;