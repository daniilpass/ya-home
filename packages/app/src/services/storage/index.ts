import { Token, YA_TOKEN_KEY } from '@homemap/shared';

export function setYaToken(token: Token) {
    document.cookie = `${YA_TOKEN_KEY}=${token.access_token}; path=/; max-age=${token.expires_in}`;
}
