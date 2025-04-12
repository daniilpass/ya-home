import { uuid } from '../../../utils/uuid';
import type { UserFile } from '../types/UserFile';

import { createUserDir, mimeToExtension, writeUserFile } from './fs';
import { metaToBuffer } from './meta';

export const saveUserFile = async (userId: string, file: UserFile): Promise<string> => {
    const fileId = uuid.new();
    const fileExt = mimeToExtension(file.meta.mime);
    file.meta.name = `${fileId}${fileExt}`;

    // Create user dir
    await createUserDir(userId);

    // Write file
    const fileBuffer = file.buffer;
    const metaBuffer = metaToBuffer(file.meta);
    await writeUserFile(userId, fileId, fileBuffer, metaBuffer);

    return fileId;
};