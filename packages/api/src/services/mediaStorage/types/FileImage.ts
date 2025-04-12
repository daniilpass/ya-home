import type { UserFile } from './UserFile';

export type FileImage = UserFile & {
    width: number;
    height: number;
    size: number;
}