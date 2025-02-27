import { Request } from "express";
import { YA_COOKIE_NAME } from '../constants';

export const getYaToken = (req: Request<unknown, unknown, unknown, unknown>) => {
    return req.cookies[YA_COOKIE_NAME];
}