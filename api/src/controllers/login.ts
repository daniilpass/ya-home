import { NextFunction, Request, Response } from 'express';

import { Device, DeviceAction, DeviceActionResult, LoginInfo } from '@homemap/shared';

import yaclient from '../yaClient/index.js';
import { YaLoginInfo } from '../yaClient/model/YaLoginInfo.js';
import { mapYaLoginInfoToLoginInfo } from '../mappers/mapYaLoginInfoToLoginInfo.js';

export const getLoginInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: YaLoginInfo = await yaclient.getLoginInfo();
        const result: LoginInfo = mapYaLoginInfoToLoginInfo(response);
        res.json(result);
    } catch (error) {
        next(error);
    }
}