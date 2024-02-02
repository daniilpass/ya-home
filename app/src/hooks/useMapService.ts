import {useEffect, useRef, useState} from 'react';
import MapService from '../services/mapService';
import {Element} from '../services/mapService/model/Element';
import {useConfiguration} from '../providers/ConfigurationContextProvider';

export const useMapService = () => {
    const mapServiceRef = useRef<MapService | null>(null);
    const {plan} = useConfiguration();
    const [data, setData] = useState<Record<string, Element>>();

    useEffect(() => {
        if (!plan) {
            return;
        }

        const { devices } = plan;
        mapServiceRef.current = new MapService(devices);
        mapServiceRef.current.onUpdate = (updatedData) => {
            setData({...updatedData});
        }
        mapServiceRef.current.start();
        return () => {
            mapServiceRef.current?.stop();
        }
    }, [plan]);

    const switchLight = (id: string) => {
        mapServiceRef.current?.switchLight(id);
    };

    return [
        data,
        switchLight,
    ] as const;
}