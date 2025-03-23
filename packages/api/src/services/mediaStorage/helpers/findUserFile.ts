import { UserFile } from '../types/UserFile';

import { getFileName, readUserFile } from './fs';
import { readUserFileMeta } from './meta';


export const findUserFile = async (userId: string, fileId: string): Promise<UserFile | null> => {
    try {
        return {
            buffer: await readUserFile(userId, getFileName(fileId)),
            meta: await readUserFileMeta(userId, fileId),
        };
    } catch {
        return null;
    }
}