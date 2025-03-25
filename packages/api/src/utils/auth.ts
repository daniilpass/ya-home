import { Request, Response } from 'express';
import { AuthResult, USER_JWT_KEY, YA_TOKEN_KEY } from '@homemap/shared';
import { RequestUserInfo } from '../types/auth';

export const getYaToken = (req: Request<unknown, unknown, unknown, unknown>): string | undefined => {
    return req.cookies[YA_TOKEN_KEY];
}

export const getUserJWT  = (req: Request<unknown, unknown, unknown, unknown>): string | undefined => {
    return req.cookies[USER_JWT_KEY];
}

export const patchRequestByUserInfo = (req: Request<unknown, unknown, unknown, unknown>, userInfo: RequestUserInfo) => {
    req.userInfo = userInfo;
}

const setServerCookie = (res: Response, name: string, value: any, maxAgeSec: number) => {
    res.cookie(name, value, { maxAge: maxAgeSec * 1000, httpOnly: true, secure: true, sameSite: 'strict' })
}

export const patchResponseByAuthData = (res: Response, authData: AuthResult) => {
    setServerCookie(res, YA_TOKEN_KEY, authData.yaToken.token, authData.yaToken.expiresIn);
    setServerCookie(res, USER_JWT_KEY, authData.userJwt.token, authData.userJwt.expiresIn * 2);
}