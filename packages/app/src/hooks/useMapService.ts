import { useEffect, useRef, useState } from 'react';

import type { Plan } from '@homemap/shared';

import MapService from '../services/mapService';
import type { Element } from '../services/mapService/model/Element';

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
            setData({ ...updatedData });
        };
        mapServiceRef.current.start();
        return () => {
            mapServiceRef.current?.finalize();
        };
    }, [plan]);

    const actionSwitch = (id: string) => {
        mapServiceRef.current?.actionSwitch(id);
    };

    return [
        data,
        actionSwitch,
    ] as const;
};