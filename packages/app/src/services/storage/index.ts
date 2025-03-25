import { AuthResult, USER_JWT_KEY, YA_TOKEN_KEY } from '@homemap/shared';

export function setAuthData({ yaToken, userJwt }: AuthResult) {
    document.cookie = `${YA_TOKEN_KEY}=${yaToken.token}; path=/; max-age=${yaToken.expiresIn}`;
    document.cookie = `${USER_JWT_KEY}=${userJwt.token}; path=/; max-age=${userJwt.expiresIn}`;
}
