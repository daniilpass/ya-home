import { UserFile } from '../types/UserFile';

import { readUserFile } from './fs';
import { metaFromBuffer } from './meta';


export const findUserFile = async (userId: string, fileId: string): Promise<UserFile | null> => {
    try {
        const { fileBuffer, metaBuffer } = await readUserFile(userId, fileId);
        return {
            buffer: fileBuffer,
            meta: metaFromBuffer(metaBuffer),
        };
    } catch {
        return null;
    }
}