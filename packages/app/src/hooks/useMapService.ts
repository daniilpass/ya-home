import {useEffect, useRef, useState} from 'react';

import { Plan } from '@homemap/shared';

import MapService from '../services/mapService';
import {Element} from '../services/mapService/model/Element';

export const useMapService = (plan: Plan | undefined) => {
    const mapServiceRef = useRef<MapService | null>(null);
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
            mapServiceRef.current?.finalize();
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