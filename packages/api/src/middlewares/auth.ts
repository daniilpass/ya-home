import { Request, Response, NextFunction } from "express";
import { YA_COOKIE_NAME } from '../constants';
import { logger } from '../utils';
import { getYaToken } from '../utils/cookie';

export const cookieAuth = ( req: Request, res: Response, next: NextFunction) => {
    if (!getYaToken(req)) {
        logger.warn("[cookieAuth] yaToken not found in cookies");
        res.status(401).end();
        return;
    }

    next();
}