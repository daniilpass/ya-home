import { Request, Response, NextFunction } from 'express';

import AuthService from '../services/authService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthService.verifyAuth(req);
        next();
    } catch {
        res.status(401).end();
    }
}
