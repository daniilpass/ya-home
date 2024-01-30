import { Device } from '@homemap/shared';

import { Request, Response } from 'express';
import yaclient from '../yaClient/index.js';
import { mapYaDeviceToDevice } from '../mappers/index.js';

export const getDevices = async (req: Request, res: Response) => {
    const yaUserInfo = await yaclient.getUserInfo();
    const ydDevices = yaUserInfo.devices;

    const devices = ydDevices.map<Device>(mapYaDeviceToDevice);

    res.json(devices);
}