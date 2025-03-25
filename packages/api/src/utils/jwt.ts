import jwt from 'jsonwebtoken';

import { UserJwt } from '../types/auth';
import { YAPI_CLIENT_SECRET } from '../constants';
import { ExpiringToken } from '@homemap/shared';

// TODO: move to config
export const jwtExpiresInSec = 60 * 60 * 24;

export function signJWT(userInfo: UserJwt): ExpiringToken {
    return {
        token: jwt.sign(userInfo, YAPI_CLIENT_SECRET, { expiresIn: jwtExpiresInSec }),
        expiresIn: jwtExpiresInSec,
    };
}

export function verifyJWT(token: string): UserJwt {
   return jwt.verify(token, YAPI_CLIENT_SECRET) as UserJwt;
}

