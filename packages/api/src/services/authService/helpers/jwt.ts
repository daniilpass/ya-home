import jwt from 'jsonwebtoken';

import type { ExpiringToken } from '@homemap/shared';

import { JWT_MAX_AGE, YAPI_CLIENT_SECRET } from '../../../constants';
import type { UserJwt } from '../types';

export function signJWT(userInfo: UserJwt): ExpiringToken {
    return {
        token: jwt.sign(userInfo, YAPI_CLIENT_SECRET, { expiresIn: JWT_MAX_AGE }),
        expiresIn: JWT_MAX_AGE,
    };
}

export function verifyJWT(token: string): UserJwt {
   return jwt.verify(token, YAPI_CLIENT_SECRET) as UserJwt;
}

