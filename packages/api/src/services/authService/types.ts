
import jwt from 'jsonwebtoken';

import { Token } from '@homemap/shared';

export type UserJwt = jwt.JwtPayload & {
    yaUserId: string;
}

export type RequestUserInfo = {
    yaUserId: string;
    yaToken: Token;
}