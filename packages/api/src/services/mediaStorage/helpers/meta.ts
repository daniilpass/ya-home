import { FileBase64 } from '../types/FileBase64';
import { FileMeta } from '../types/FileMeta';
import { getMetaFileName, readUserFile } from './fs';


export const createFileMeta = (file: FileBase64, realFilename: string): Buffer => {
    const metaArr = [
        file.mime,
        realFilename,
    ];

    return Buffer.from(metaArr.join('\r\n'));
}

export  const readUserFileMeta = async (userId: string, fileId: string): Promise<FileMeta> => {
    const metaBuffer = await readUserFile(userId, getMetaFileName(fileId));
    const metaArr = metaBuffer.toString().split('\r\n');

    return {
        mime: metaArr[0],
        name: metaArr[1],
    }
}