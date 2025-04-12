import {useContext} from 'react';

import {TransformContext} from './context';

export const useTransformContext = () => {
    const context = useContext(TransformContext);
    if (context === undefined) {
        throw new Error('Context must be used within a Provider');
    }
    return context;
};
