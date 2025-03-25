import { Request, Response, NextFunction } from "express";

import { logger } from '../utils';
import AuthService from '../services/authService';

export const cookieTest = (req: Request, res: Response, next: NextFunction) => {
    const testServerCookieKey = 'server-ya-token';

    logger.warn(`SEREVER COOKIE: ${req.cookies[testServerCookieKey + 'hss']}`);
    logger.warn(`SEREVER COOKIE: ${req.cookies[testServerCookieKey + 'hs']}`);
    logger.warn(`SEREVER COOKIE: ${req.cookies[testServerCookieKey + 'h']}`);
    logger.warn(`SEREVER COOKIE: ${req.cookies[testServerCookieKey]}`);

    // TODO: not working in "Ya Station Max Duo"
    const maxAgeMs = 1000 * 60;
    res.cookie(testServerCookieKey + 'hss', Date.now(), { maxAge: maxAgeMs, httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie(testServerCookieKey + 'hs', Date.now(), { maxAge: maxAgeMs, httpOnly: true, secure: true });
    res.cookie(testServerCookieKey + 'h', Date.now(), { maxAge: maxAgeMs, httpOnly: true });
    res.cookie(testServerCookieKey, Date.now(), { maxAge: maxAgeMs });

    next();
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthService.verifyAuth(req);
    } catch (error: unknown) {
        logger.warn(`[auth] Auth verification failed. ${error?.toString()}`);

        res.status(401).end();
        return;
    }

    next();
}