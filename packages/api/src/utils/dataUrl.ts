import type { UserFile } from '../services/mediaStorage/types/UserFile';

const dataUrlBase64Regex = /^(data){1}:(?<mime>[a-zA-Z/]+){1};(base64),(?<data>.*)/;

export const parseBase64DataUrl = (dataUrl: string): UserFile | null => {
    const match = dataUrl.match(dataUrlBase64Regex);
    if (!match) {
        return null;
    }

    return {
        buffer: Buffer.from(match.groups!['data'], 'base64'),
        meta: {
            mime: match.groups!['mime'],
            name: '',
        },
    };
};
