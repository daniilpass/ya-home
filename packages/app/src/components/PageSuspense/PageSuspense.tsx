import { Suspense } from 'react';

import { useLocation } from 'react-router-dom';

import AppLoader from '../AppLoader';

export const PageSuspense = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    return <Suspense key={location.key} fallback={<AppLoader isLoading />}>{children}</Suspense>;
};
