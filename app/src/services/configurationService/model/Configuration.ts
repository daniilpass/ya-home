import {Element} from './Element';

export type Configuration = {
    apiHost: string;
    apiPollInterval: number;
    apiSyncTimeout: number;
    mapSrc: string;
    elements: Record<string, Element>;
}
