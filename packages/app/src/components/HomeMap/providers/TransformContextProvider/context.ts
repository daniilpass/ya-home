import {createContext} from 'react';

export type State = {
    scale: number;
    rotate: number;
    editElementDrag: boolean;
}

const DEFAULT_VALUE = {
    scale: 1,
    rotate: 0,
    editElementDrag: false,
};

export const TransformContext = createContext<State>(DEFAULT_VALUE);