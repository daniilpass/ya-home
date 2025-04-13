import type { FC, ReactNode } from 'react';

import type { State } from './context';
import { TransformContext } from './context';

type Props = {
    value: State,
    children: ReactNode,
}

export const TransformContextProvider: FC<Props> = ({ value, children }) => {    
    return (
        <TransformContext.Provider value={value}>
            {children}
        </TransformContext.Provider>
    );
};
