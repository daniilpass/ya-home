
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthResult, Token } from '@homemap/shared';

import YaService from '../yaService';
import { getYaToken, getUserJWT, patchRequestByUserInfo, patchResponseByAuthData } from '../../utils/auth';
import { signJWT, verifyJWT } from '../../utils/jwt';

import { tokenFromEncryptedString, tokenToEncryptedString } from './helpers';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserJwt } from '../../types/auth';

// TODO: refreshAuth

const authByCode = async (req: Request, res: Response, code: string): Promise<AuthResult> => {
    const token: Token = await new YaService(req).getToken(code);

    patchRequestByUserInfo(req, {
        yaUserId: '',
        yaToken: token,
    });

    const userId = await new YaService(req).getUserId();

    patchRequestByUserInfo(req, {
        yaUserId: userId,
        yaToken: token,
    });

    const authResult: AuthResult = {
        userJwt: signJWT({ yaUserId: userId }),
        yaToken: {
            token: tokenToEncryptedString(token),
            expiresIn: token.expires_in,
        }
    }

    patchResponseByAuthData(res, authResult);

    return authResult
}

const verifyAuth = (req: Request) => {
    const yaTokenString = getYaToken(req);
    const userJwtString = getUserJWT(req);

    if (!yaTokenString) {
        throw new UnauthorizedError('Token is missing');
    }

    if (!userJwtString) {
        throw new UnauthorizedError('User JWT is missing');
    }

    let userJwt: UserJwt;
    try {
        userJwt = verifyJWT(userJwtString);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // TODO: reniew jwt
        }

        throw error;
    }

    const yaToken = tokenFromEncryptedString(yaTokenString);

    patchRequestByUserInfo(req, {
        yaUserId: userJwt.yaUserId,
        yaToken,
    });
}

export const AuthService = {
    authByCode,
    verifyAuth,
}