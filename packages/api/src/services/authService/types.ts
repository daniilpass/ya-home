
import type jwt from 'jsonwebtoken';

import type { Token } from '@homemap/shared';

export type UserJwt = jwt.JwtPayload & {
    yaUserId: string;
}

export type RequestUserInfo = {
    yaUserId: string;
    yaToken: Token;
}