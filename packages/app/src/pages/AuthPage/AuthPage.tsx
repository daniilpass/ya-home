import { Box, Typography } from '@mui/material';

import './style.css';
import RouterLinkButton from '../../common/components/RouterLinkButton';
import { useAuth, useAuthUrl, useSearchParamsCode } from './hooks';

export const AuthPage = () => {
    const authCode = useSearchParamsCode();

    return (
        <div className="auth-page">
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
            }}>
                { authCode ? <AuthInProgress authCode={authCode} /> : <AuthNeeded /> }
            </Box>
        </div>
    );
}

const AuthNeeded = () => {
    const authUrl = useAuthUrl();

    return (
        <>
            <Typography component="h1" variant="h5" align="center" marginBottom={1}>
                Требуется авторизация
            </Typography>
            {
                authUrl && (
                    <RouterLinkButton to={authUrl} variant="contained">
                        Войти
                    </RouterLinkButton>
                )

            }
        </>
    )
}

const AuthInProgress = ({ authCode }: { authCode: string }) => {
    useAuth(authCode);

    return (
        <Typography component="h1" variant="h5" align="center" marginBottom={1}>
            Идет авторизация
        </Typography>
    )
}
