import { FileMeta } from '../types/FileMeta';
import { getMetaFileName, getUserFilepath, readUserFile, writeUserFile } from './fs';


const metaToArray = (fileMeta: FileMeta) => [
    fileMeta.mime,
    fileMeta.name,
];

const metaFromArray = (metaArray: string[]) => ({
    mime: metaArray[0],
    name: metaArray[1],
})

export const writeUserFileMeta = (userId: string, fileId: string, fileMeta: FileMeta) => {
    const metaContentBuffer = Buffer.from(metaToArray(fileMeta).join('\r\n'));

    return writeUserFile(userId, getMetaFileName(fileId), metaContentBuffer);
}

export  const readUserFileMeta = async (userId: string, fileId: string): Promise<FileMeta> => {
    const metaBuffer = await readUserFile(userId, getMetaFileName(fileId));
    const metaArr = metaBuffer.toString().split('\r\n');

    return metaFromArray(metaArr);
}