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
        await AuthService.authByCode(req as Request, res, req.query.code);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}

export const refresh = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        await AuthService.refreshAuth(req as Request, res);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
}
