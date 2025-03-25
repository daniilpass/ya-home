import { ExpiringToken, Token } from '@homemap/shared';

import { decryptByClientSecret, encryptByClientSecret } from '../../../utils/crypto';


export const tokenToEncryptedString = ({ access_token, refresh_token, expires_in }: Token): string => {
    return encryptByClientSecret([access_token, refresh_token, expires_in].join('.'));
}

export const tokenFromEncryptedString = (tokenStr: string): Pick<Token, 'access_token' | 'refresh_token' | 'expires_in'> => {
    const [access_token, refresh_token, expires_in] = decryptByClientSecret(tokenStr).split('.');
    return { access_token, refresh_token, expires_in: Number.parseInt(expires_in) }
}

export const encryptToken = (yaToken: Token): ExpiringToken => {
    return {
        token: tokenToEncryptedString(yaToken),
        expiresIn: yaToken.expires_in,
    }
}