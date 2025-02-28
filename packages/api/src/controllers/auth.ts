import { NextFunction, Request, Response } from 'express';

import { Token } from '@homemap/shared';

import YaService from '../services/yaService';

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

export const getToken = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        const result: Token = await new YaService(req).getToken(req.query.code);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const auth = async (req: Request<unknown, unknown, unknown, QueryParams>, res: Response, next: NextFunction) => {
    try {
        const token: Token = await new YaService(req).getToken(req.query.code);
        // TODO: not working in "Ya Station Max Duo"
        // res.cookie(YA_TOKEN_KEY, token.access_token, { maxAge: token.expires_in * 1000, httpOnly: true });
        res.json(token);
    } catch (error) {
        next(error);
    }
}