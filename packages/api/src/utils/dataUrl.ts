import { FileBase64 } from '../services/mediaStorage/types/FileBase64';

const dataUrlBase64Regex = /^(data){1}:(?<mime>[a-zA-Z\/]+){1};(base64),(?<data>.*)/;

export const parseBase64DataUrl = (dataUrl: string): FileBase64 | null => {
    const match = dataUrl.match(dataUrlBase64Regex);
    if (!match) {
        return null;
    }

    return {
        mime: match.groups!['mime'],
        data: match.groups!['data'],
    }
}
