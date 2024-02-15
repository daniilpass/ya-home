import { NextFunction, Request, Response } from 'express';

import { UserInfo } from '@homemap/shared';

import YaService from '../services/yaService';

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result: UserInfo = await YaService.getUserInfo();
        res.json(result);
    } catch (error) {
        next(error);
    }
}