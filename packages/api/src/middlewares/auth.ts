import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../utils';
import AuthService, { JwtMissingError } from '../services/authService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthService.verifyAuth(req);
        next();
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError || error instanceof JwtMissingError) {
            await refresh(req, res, next);
            return;
        }

        logger.warn(`[auth] Auth verification failed. ${error?.toString()}`);
        res.status(401).end();
    }
}

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AuthService.refreshAuth(req, res);
        next();
    } catch (error: unknown) {
        logger.warn(`[auth] Auth refresh failed. ${error?.toString()}`);
        res.status(401).end();
    }
}
