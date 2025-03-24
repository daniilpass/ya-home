import { AuthResult, USER_JWT_KEY, YA_TOKEN_KEY } from '@homemap/shared';

export function setAuthData({ token, userJwt }: AuthResult) {
    // TODO: ; max-age=${token.expires_in}
    document.cookie = `${YA_TOKEN_KEY}=${token}; path=/`;
    document.cookie = `${USER_JWT_KEY}=${userJwt}; path=/`;
}
