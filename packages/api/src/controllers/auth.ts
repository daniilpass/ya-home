import { NextFunction, Request, Response } from 'express';

import { Token } from '@homemap/shared';

import YaService from '../services/yaService';
import { YA_COOKIE_NAME } from '../constants';

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

export const auth = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        const token: Token = await YaService.getToken(req.query.code);
        res.cookie(YA_COOKIE_NAME, token.access_token, { maxAge: token.expires_in, httpOnly: true });
        res.status(200).end();
    } catch (error) {
        next(error);
    }
}