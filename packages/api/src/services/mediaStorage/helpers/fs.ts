import { promises as fs } from 'fs';
import path from 'path';

import { MEDIA_STORAGE_PATH } from '../../../constants';
import { META_EXTENSION, MIME_TO_EXTENSION } from '../constants';

export const mimeToExtension = (mime: string): string | null => MIME_TO_EXTENSION[mime] ?? null;

export const getFileName = (fileId: string) => `${fileId}`;

export const getMetaFileName = (fileId: string) => `${fileId}${META_EXTENSION}`;

export const writeUserMetaFile = (userId: string, fileId: string,metaContent: Buffer) => {
    const metaFilename = getMetaFileName(fileId);
    const metaFilepath = getUserFilepath(userId, metaFilename);
    return fs.writeFile(metaFilepath, metaContent);
}

export const writeUserFile = (userId: string, fileId: string, data: Buffer | string) => {
    const dataFilename = getFileName(fileId);
    const dataFilepath = getUserFilepath(userId, dataFilename);
    return fs.writeFile(dataFilepath, data, Buffer.isBuffer(data) ? 'binary' : 'base64');
}

export const getUserDir = (userId: string) => path.join(MEDIA_STORAGE_PATH, userId);

export const createUserDir = (userId: string) => fs.mkdir(getUserDir(userId), { recursive: true });

export const getUserFilepath = (userId: string, file: string) => path.join(getUserDir(userId), file);

export const readUserFile = (userId: string, file: string) => fs.readFile(getUserFilepath(userId, file));

export const unlinkUserFile = (userId: string, file: string) => fs.unlink(getUserFilepath(userId, file));