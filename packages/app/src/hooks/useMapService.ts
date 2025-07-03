import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { Plan } from '@homemap/shared';

import MapService from '../services/mapService';
import type { Element } from '../services/mapService/model/Element';

export const useMapService = (plan: Plan) => {
    const isMountedRef = useRef<boolean>(false); 
    const mapServiceRef = useRef<MapService | null>(null);
    const [data, setData] = useState<Record<string, Element>>();

    useMemo(() => {
        if (mapServiceRef.current) {
            mapServiceRef.current.finalize();
            mapServiceRef.current = null;
        }

        const { devices } = plan;

        mapServiceRef.current = new MapService(devices);
        mapServiceRef.current.onUpdate = (updatedData) => {
            if (isMountedRef.current) {
                setData({ ...updatedData });
            }
        };
        mapServiceRef.current.start();
    }, [plan]);

    useLayoutEffect(() => {
        isMountedRef.current = true;
        setData({ ...mapServiceRef.current?.elements });
    }, []);

    const actionSwitch = (id: string) => {
        mapServiceRef.current?.actionSwitch(id);
    };

    return [
        data,
        actionSwitch,
    ] as const;
};