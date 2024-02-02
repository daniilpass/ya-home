import { NextFunction, Request, Response } from 'express';

import { Device, DeviceAction, DeviceActionResult, LoginInfo } from '@homemap/shared';

import yaclient from '../yaClient';
import { YaLoginInfo } from '../yaClient/model/YaLoginInfo';
import { mapYaLoginInfoToLoginInfo } from '../mappers/mapYaLoginInfoToLoginInfo';

export const getLoginInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: YaLoginInfo = await yaclient.getLoginInfo();
        const result: LoginInfo = mapYaLoginInfoToLoginInfo(response);
        res.json(result);
    } catch (error) {
        next(error);
    }
}