import { UserFile } from '../services/mediaStorage/types/UserFile';

const dataUrlBase64Regex = /^(data){1}:(?<mime>[a-zA-Z\/]+){1};(base64),(?<data>.*)/;

export const parseBase64DataUrl = (dataUrl: string): UserFile | null => {
    const match = dataUrl.match(dataUrlBase64Regex);
    if (!match) {
        return null;
    }

    return {
        mime: match.groups!['mime'],
        buffer: Buffer.from(match.groups!['data'], 'base64'),
    }
}
