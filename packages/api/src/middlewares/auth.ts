import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../utils';
import AuthService, { JwtMissingError } from '../services/authService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthService.verifyAuth(req);
        next();
    } catch (error: unknown) {
        res.status(401).end();
    }
}
