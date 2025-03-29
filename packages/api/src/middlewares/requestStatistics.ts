import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';
import StatisticsService from '../services/statisticsService';
import { getErrorMessage } from '../utils/errors';

const getXForwardedFor = (req: Request) => {
    const xffHeader = req.headers['x-forwarded-for'];
    return Array.isArray(xffHeader) ? xffHeader[0] : xffHeader;
}
const getUserAddress = (req: Request) => {
    let ip = getXForwardedFor(req) || req.connection.remoteAddress || req.socket.remoteAddress || '';
    ip = ip.split(',')[0]; // take first ip in chain
    ip = ip.split(':').slice(-1)[0]; // delete subnet prexis, e.g. ::ffff:
    return ip;
}

const getStatisctics = (req: Request, res: Response, requestStart: number) => {
    return {
        userId: req.userInfo?.yaUserId ?? 'anonymous',
        route: req.route?.path as string,
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        date: new Date(requestStart),
        duration: Math.ceil(Date.now() - requestStart),
        userAddress: getUserAddress(req),
        userAgent: req.get('User-Agent') ?? null,
    }
}

export const requestStatistics = (req: Request, res: Response, next: NextFunction) => {
    const requestStart = Date.now();

    res.on('finish', function () {
        try {
            const statistics = getStatisctics(req, res, requestStart);
            StatisticsService.logUserRequest(statistics);
        } catch (error) {
            logger.error(`[statistics] Error occured while trying get request statistics. Error: ${getErrorMessage(error)}`);
        }
    });

    next();
}
