import { NextFunction, Request, Response } from 'express';

import { Token } from '@homemap/shared';

import YaService from '../services/yaService';

type QueryParams = {
    code: string;
}

export const getAuthUrl = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const result: string = YaService.getAuthUrl();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const getToken = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        const result: Token = await YaService.getToken(req.query.code);
        res.json(result);
    } catch (error) {
        next(error);
    }
}