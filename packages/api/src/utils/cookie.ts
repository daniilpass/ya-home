import { Request } from "express";
import { YA_TOKEN_KEY } from '@homemap/shared';

export const getYaToken = (req: Request<unknown, unknown, unknown, unknown>): string | undefined => {
    return req.cookies[YA_TOKEN_KEY];
}