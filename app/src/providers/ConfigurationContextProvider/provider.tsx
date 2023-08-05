import {
    useEffect,
    useState,
    FC,
    ReactNode,
} from 'react'


import {loadConfiguration} from '../../services/configurationService';
import {Configuration} from '../../services/configurationService/model/Configuration';

import {ConfigurationContext} from './context';

type Props = {
    children: ReactNode
}

export const ConfigurationContextProvider: FC<Props> = ({children}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);

    useEffect(() => {
        loadConfiguration().then(cfg => {
            setConfiguration(cfg);
            setIsLoaded(true);
        });
    }, []);
    
    return (
        <ConfigurationContext.Provider value={{
            isLoaded,
            configuration
        }}>
            {children}
        </ConfigurationContext.Provider>
    )
}
