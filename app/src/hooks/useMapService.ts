import { useEffect, useRef, useState } from 'react';
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

        const {apiHost, apiPollInterval, apiSyncTimeout, elements} = configuration;
        mapServiceRef.current = new MapService(apiHost, apiPollInterval, apiSyncTimeout, elements);
        mapServiceRef.current.start();
        mapServiceRef.current.onUpdate = (updateData) => {
            setData(updateData);
        }
        return () => {
            mapServiceRef.current?.stop();
        }
    }, [configuration]);

    return data;
}