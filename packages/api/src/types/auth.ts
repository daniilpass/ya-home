import { Token } from '@homemap/shared';
import jwt from 'jsonwebtoken';

export type UserJwt = jwt.JwtPayload & {
    yaUserId: string;
}

export type RequestUserInfo = jwt.JwtPayload & {
    yaUserId: string;
    yaToken: Token;
}