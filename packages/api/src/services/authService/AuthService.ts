
import type { Request, Response } from 'express';

import YaService from '../yaService';

import { signJWT, encryptToken, getYaToken, getUserJwt, patchRequestUserInfo, setYaToken, setUserJwt, tokenFromEncryptedString, verifyJWT } from './helpers';
import { JwtMissingError, TokenMissingError } from './errors';

const issueUserJwt = async (req: Request, res: Response) => {
    const yaUserId = await new YaService(req).getUserId();
    patchRequestUserInfo(req, { yaUserId });

    const userJwt = signJWT({ yaUserId });
    setUserJwt(res, userJwt);
};

export const authByCode = async (req: Request, res: Response, code: string) => {
    const yaToken = await new YaService(req).getToken(code);
    patchRequestUserInfo(req, { yaToken });

    const yaTokenExpiring = encryptToken(yaToken);
    setYaToken(res, yaTokenExpiring);

    await issueUserJwt(req, res);
};

export const refreshAuth = async (req: Request, res: Response) => {
    // TODO: refresh ya token if needed
    const yaToken = verifyToken(req);
    patchRequestUserInfo(req, { yaToken });

    await issueUserJwt(req, res);
};

export const verifyAuth = (req: Request) => {
    const yaToken = verifyToken(req);
    const userJwt = verifyJwt(req);

    patchRequestUserInfo(req, {
        yaUserId: userJwt.yaUserId,
        yaToken,
    });
};

const verifyToken = (req: Request) => {
    const yaTokenString = getYaToken(req);
    
    if (!yaTokenString) {
        throw new TokenMissingError();
    }

    return tokenFromEncryptedString(yaTokenString);
};

const verifyJwt = (req: Request) => {
    const userJwtString = getUserJwt(req);

    if (!userJwtString) {
        throw new JwtMissingError();
    }

    return verifyJWT(userJwtString);
};
