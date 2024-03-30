import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import AlertContainer from '../components/AlertContainer';
import DialogContainer from '../components/DialogContainer';
import ErrorFallback from '../components/ErrorFallback';

const RootLayout = () => {
    return (
        <>
            <AlertContainer />
            <DialogContainer />
            <ErrorBoundary fallback={<ErrorFallback />} >
                <Outlet />
            </ErrorBoundary>
        </>     
    );
}

export default RootLayout;