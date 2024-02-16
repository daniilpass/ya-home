import { useEffect } from 'react';
import { useDispatch } from '../../store/hooks';

const ErrorFallback = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch.dialog.crash('Что-то важное сломалось');
    }, [dispatch]);

    return <div></div>;
}

export default ErrorFallback;