import { promises as fs } from 'fs';
import path from 'path';

import { MEDIA_STORAGE_PATH } from '../../../constants';
import { META_EXTENSION, MIME_TO_EXTENSION } from '../constants';

export const mimeToExtension = (mime: string): string | null => MIME_TO_EXTENSION[mime] ?? null;

export const getFileName = (fileId: string) => `${fileId}`;

export const getMetaFileName = (fileId: string) => `${fileId}${META_EXTENSION}`;

export const getUserDir = (userId: string) => path.join(MEDIA_STORAGE_PATH, userId);

export const createUserDir = (userId: string) => fs.mkdir(getUserDir(userId), { recursive: true });

export const getUserFilepath = (userId: string, file: string) => path.join(getUserDir(userId), file);

export const readUserFile = (userId: string, file: string) => fs.readFile(getUserFilepath(userId, file));

export const writeUserFile = (userId: string, file: string, data: Buffer | string) =>
    fs.writeFile(getUserFilepath(userId, file), data, Buffer.isBuffer(data) ? 'binary' : 'base64');

export const unlinkUserFile = (userId: string, file: string) => fs.unlink(getUserFilepath(userId, file));