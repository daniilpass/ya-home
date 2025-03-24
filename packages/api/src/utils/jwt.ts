import jwt from 'jsonwebtoken';

import { UserJwt } from '../types/auth';
import { YAPI_CLIENT_SECRET } from '../constants';

export function signJWT(userInfo: UserJwt) {
    // TODO: expires in
    return jwt.sign(userInfo, YAPI_CLIENT_SECRET);
}

export function verifyJWT(token: string): UserJwt {
   return jwt.verify(token, YAPI_CLIENT_SECRET) as UserJwt;
}

