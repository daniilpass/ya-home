
import { Request } from 'express';

import { AuthResult, Token } from '@homemap/shared';

import YaService from '../yaService';
import { getYaToken, getUserJWT, patchRequestByUserInfo } from '../../utils/auth';
import { signJWT, verifyJWT } from '../../utils/jwt';

import { tokenFromEncryptedString, tokenToEncryptedString } from './helpers';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserJwt } from '../../types/auth';

const authByCode = async (req: Request, code: string): Promise<AuthResult> => {
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

    const authResult = {
        userJwt: signJWT({ yaUserId: userId }),
        token: tokenToEncryptedString(token),
    }

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