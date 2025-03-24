import { NextFunction, Request, Response } from 'express';

import YaService from '../services/yaService';
import AuthService from '../services/authService';

type QueryParams = {
    code: string;
}

export const getAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result: string = new YaService(req).getAuthUrl();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const auth = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        const authResult = await AuthService.authByCode(req as Request, req.query.code);

        res.json(authResult);
    } catch (error) {
        next(error);
    }
}