import {useEffect, useRef, useState} from 'react';
import MapService from '../services/mapService';
import {Element} from '../services/mapService/model/Element';
import {useConfiguration} from '../providers/ConfigurationContextProvider';

export const useMapService = () => {
    const mapServiceRef = useRef<MapService | null>(null);
    const {configuration} = useConfiguration();
    const [data, setData] = useState<Record<string, Element>>();

    useEffect(() => {
        if (!configuration) {
            return;
        }

        const {elements} = configuration;
        mapServiceRef.current = new MapService(elements);
        mapServiceRef.current.onUpdate = (updatedData) => {
            setData({...updatedData});
        }
        mapServiceRef.current.start();
        return () => {
            mapServiceRef.current?.stop();
        }
    }, [configuration]);

    const switchLight = (id: string) => {
        mapServiceRef.current?.switchLight(id);
    };

    return [
        data,
        switchLight,
    ] as const;
}