import {createContext} from 'react'
import { Plan } from '@homemap/shared';

type State = {
    isLoaded: boolean;
    plan: Plan | undefined;
}

const DEFAULT_VALUE = {
    isLoaded: false,
    plan: undefined,
}

export const ConfigurationContext = createContext<State>(DEFAULT_VALUE);