import ApiClient from '../api';

export const uuidOrDataToURL = (uuidOrData?: string) => {
    if (!uuidOrData) {
        return uuidOrData;
    }

    if (uuidOrData.startsWith('data:')) {
        return uuidOrData;
    }

    return ApiClient.getMediaUrl(uuidOrData);
}