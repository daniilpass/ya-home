export const YA_TOKEN_KEY = 'app-ya-token';
export const USER_JWT_KEY = 'app-user-info';

export type ExpiringToken = {
    token: string;
    expiresIn: number;
}

export type AuthResult = {
    userJwt: ExpiringToken;
    yaToken: ExpiringToken;
}