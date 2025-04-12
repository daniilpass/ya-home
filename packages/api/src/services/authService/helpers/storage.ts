import type { Request, Response } from 'express';

import type { ExpiringToken} from '@homemap/shared';
import { USER_JWT_KEY, YA_TOKEN_KEY } from '@homemap/shared';

import type { RequestUserInfo } from '../types';

const setServerCookie = (res: Response, name: string, value: unknown, maxAgeSec: number) => {
    res.cookie(name, value, { maxAge: maxAgeSec * 1000, httpOnly: true, secure: true, sameSite: 'strict' });
};

export const getYaToken = (req: Request): string | undefined => {
    return req.cookies[YA_TOKEN_KEY];
};

export const setYaToken = (res: Response, token: ExpiringToken) => {
    setServerCookie(res, YA_TOKEN_KEY, token.token, token.expiresIn);
};

export const getUserJwt  = (req: Request): string | undefined => {
    return req.cookies[USER_JWT_KEY];
};

export const setUserJwt = (res: Response, token: ExpiringToken) => {
    setServerCookie(res, USER_JWT_KEY, token.token, token.expiresIn);
};

export const patchRequestUserInfo = (req: Request, partialUserInfo: Partial<RequestUserInfo>) => {
    if (!req.userInfo) {
        req.userInfo = {};
    }

    Object.assign(req.userInfo, partialUserInfo);
};