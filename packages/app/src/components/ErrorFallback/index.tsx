import { useEffect } from 'react';
import { useDispatch } from '../../store/hooks';

type ErrorFallbackProps = {
    error: Error;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch.dialog.crash({
            content: 'Что-то важное сломалось',
            error,
        });
    }, [dispatch, error]);

    return <div></div>;
}

export default ErrorFallback;