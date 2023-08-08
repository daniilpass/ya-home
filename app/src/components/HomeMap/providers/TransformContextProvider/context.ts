import {createContext} from 'react'

export type State = {
    scale: number;
    rotateDegree: number;
}

const DEFAULT_VALUE = {
    scale: 1,
    rotateDegree: 0,
}

export const TransformContext = createContext<State>(DEFAULT_VALUE);