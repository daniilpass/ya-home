export const YA_TOKEN_KEY = 'app-ya-token';
export const USER_JWT_KEY = 'app-user-info';

export type AuthResult = {
    userJwt: string;
    token: string;
}