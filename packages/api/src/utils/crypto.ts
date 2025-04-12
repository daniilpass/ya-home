import CryptoJS from 'crypto-js';

import { YAPI_CLIENT_SECRET } from '../constants';

export function encryptByClientSecret(rawInput: string) {
    return CryptoJS.AES.encrypt(rawInput, YAPI_CLIENT_SECRET).toString();
}

export function decryptByClientSecret(hashedInput: string) {
    return CryptoJS.AES.decrypt(hashedInput, YAPI_CLIENT_SECRET).toString(CryptoJS.enc.Utf8);
}
