import { Request } from "express";
import { USER_JWT_KEY, YA_TOKEN_KEY } from '@homemap/shared';
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