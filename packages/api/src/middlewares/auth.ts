import { Request, Response, NextFunction } from "express";

import { logger } from '../utils';
import AuthService from '../services/authService';

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