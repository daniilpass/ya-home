import { logger } from './utils';

export const PORT = process.env.PORT || 3000;
export const YAPI_LOGIN_BASE_URL =  process.env.YAPI_LOGIN_BASE_URL;
export const YAPI_IOT_BASE_URL =  process.env.YAPI_IOT_BASE_URL;
export const YAPI_AUTH_TOKEN =  process.env.YAPI_AUTH_TOKEN;
export const CACHE_TTL = Number(process.env.CACHE_TTL) || 5;
export const DB_STORAGE_PATH = './appData';
export const MEDIA_STORAGE_PATH = './appData/media';

logger.info('[config] PORT = ' + PORT );
logger.info('[config] YAPI_LOGIN_BASE_URL = ' + YAPI_LOGIN_BASE_URL);
logger.info('[config] YAPI_IOT_BASE_URLORT = ' + YAPI_IOT_BASE_URL);
logger.info('[config] YAPI_AUTH_TOKEN.length = ' + YAPI_AUTH_TOKEN?.length);
logger.info('[config] DB_STORAGE_PATH = ' + DB_STORAGE_PATH);
logger.info('[config] MEDIA_STORAGE_PATH = ' + MEDIA_STORAGE_PATH);