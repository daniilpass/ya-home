import { FileInfo } from '../types/FileInfo';

import { getFileName, readUserFile } from './fs';
import { readUserFileMeta } from './meta';


export const findUserFile = async (userId: string, fileId: string): Promise<FileInfo | null> => {
    try {
        return {
            data: await readUserFile(userId, getFileName(fileId)),
            meta: await readUserFileMeta(userId, fileId),
        };
    } catch {
        return null;
    }
}