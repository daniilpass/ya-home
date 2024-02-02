import { useEffect, useState, FC, ReactNode } from 'react'
import { Plan } from '@homemap/shared';

import {ConfigurationContext} from './context';
import ApiClient from '../../api';

type Props = {
    children: ReactNode
}

export const ConfigurationContextProvider: FC<Props> = ({children}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [plan, setPlan] = useState<Plan | undefined>(undefined);

    useEffect(() => {
        ApiClient.getPlan().then(plan => {
            setPlan(plan);
            setIsLoaded(true);
        });
    }, []);
    
    return (
        <ConfigurationContext.Provider value={{
            isLoaded,
            plan
        }}>
            {children}
        </ConfigurationContext.Provider>
    )
}
