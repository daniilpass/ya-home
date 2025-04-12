import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ApiClient from '../../api';
import { routes } from '../../app/router';

export const useAuthUrl = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        ApiClient
            .getAuthUrl()
            .then((authUrl) => {
                setUrl(authUrl);
            })
            .catch(() => {
                dispatch.dialog.crash('Не удалось получить URL авторизации');
            });
    }, [dispatch]);

    return url;
};

export const useSearchParamsCode = () => {
    const [searchParams] = useSearchParams();
    return searchParams.get('code');
};

export const useAuth = (code: string) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        ApiClient
            .auth(code)
            .then(() => {
                navigate(routes.root);
            })
            .catch(() => {
                dispatch.dialog.crash('Не удалось авторизоваться');
            });
    }, [code, dispatch, navigate]);
};