import {useContext} from 'react';
import {ConfigurationContext} from './context'

export const useConfiguration = () => {
    const context = useContext(ConfigurationContext)
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}
