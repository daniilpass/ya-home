import { Request, Response, NextFunction } from "express";

import { YA_TOKEN_KEY } from '@homemap/shared';

import { logger } from '../utils';
import { getYaToken as getYaTokenCookie  } from '../utils/cookie';
import { getYaToken as getYaTokenHeader  } from '../utils/headers';

export const cookieAuth = ( req: Request, res: Response, next: NextFunction) => {
    if (!getYaTokenCookie(req)) {
        logger.warn(`[cookieAuth] ${YA_TOKEN_KEY} not found in cookies`);
        res.status(401).end();
        return;
    }

    next();
}

export const headerAuth = ( req: Request, res: Response, next: NextFunction) => {
    if (!getYaTokenHeader(req)) {
        logger.warn(`[headerAuth] ${YA_TOKEN_KEY} not found in header`);
        res.status(401).end();
        return;
    }

    next();
}