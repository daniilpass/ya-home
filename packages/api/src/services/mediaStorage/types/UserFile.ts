import type { FileMeta } from './FileMeta';

export type UserFile = {
    buffer: Buffer;
    meta: FileMeta;
}