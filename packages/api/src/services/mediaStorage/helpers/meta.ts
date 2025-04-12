import type { FileMeta } from '../types/FileMeta';

const metaToArray = (fileMeta: FileMeta) => [
    fileMeta.mime,
    fileMeta.name,
];

const metaFromArray = (metaArray: string[]): FileMeta => ({
    mime: metaArray[0],
    name: metaArray[1],
})

export const metaToBuffer = (fileMeta: FileMeta) => Buffer.from(metaToArray(fileMeta).join('\r\n'));

export const metaFromBuffer = (buffer: Buffer) => metaFromArray(buffer.toString().split('\r\n'));
