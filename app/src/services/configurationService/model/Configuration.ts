import {Element} from './Element';

export type Configuration = {
    mapSrc: string;
    elements: Record<string, Element>;
}
