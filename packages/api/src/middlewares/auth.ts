import { Request, Response, NextFunction } from "express";
import { YA_COOKIE_NAME } from '../constants';
import { logger } from '../utils';

export const cookieAuth = ( req: Request, res: Response, next: NextFunction) => {
    logger.debug("[cookieAuth] Read cookies");
    const yaToken = req.cookies[YA_COOKIE_NAME];

    if (!yaToken) {
        logger.debug("[cookieAuth] yaToken not found in cookies");
        res.status(401).end();
        return;
    }

    next();
}