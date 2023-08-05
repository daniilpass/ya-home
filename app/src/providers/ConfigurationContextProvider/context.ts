import {createContext} from 'react'
import {Configuration} from '../../tools/loadConfiguration';

type State = {
    isLoaded: boolean;
    configuration: Configuration | undefined;
}

const DEFAULT_VALUE = {
    isLoaded: false,
    configuration: undefined,
}

export const ConfigurationContext = createContext<State>(DEFAULT_VALUE);