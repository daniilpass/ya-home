import { MediaBase64 } from '../types/MediaBase64';

const dataUrlBase64Regex = /^(data){1}:(?<mime>[a-zA-Z\/]+){1};(base64),(?<data>.*)/;

export const parseMediaBase64DataUrl = (dataUrl: string): MediaBase64 | null => {
    const match = dataUrl.match(dataUrlBase64Regex);
    if (!match) {
        return null;
    }

    return {
        mime: match.groups!['mime'],
        data: match.groups!['data'],
    }
}
