import { logger } from './utils';

export const PORT = process.env.PORT || 3000;
export const YAPI_LOGIN_BASE_URL = process.env.YAPI_LOGIN_BASE_URL;
export const YAPI_IOT_BASE_URL = process.env.YAPI_IOT_BASE_URL;
export const YAPI_OAUTH_BASE_URL = process.env.YAPI_OAUTH_BASE_URL;
export const YAPI_OAUTH_REDIRECT_URL = process.env.YAPI_OAUTH_REDIRECT_URL;
export const YAPI_CLIENT_ID =  process.env.YAPI_CLIENT_ID || '';
export const YAPI_CLIENT_SECRET =  process.env.YAPI_CLIENT_SECRET || '';
export const CACHE_TTL = Number(process.env.CACHE_TTL) || 5;
export const JWT_MAX_AGE = Number(process.env.JWT_MAX_AGE) || 604800;
export const STAT_BATCH_SIZE = Number(process.env.STAT_BATCH_SIZE) || 1000;
export const DB_STORAGE_PATH = './appData';
export const MEDIA_STORAGE_PATH = './appData/media';

logger.info('[config] PORT = ' + PORT );
logger.info('[config] YAPI_LOGIN_BASE_URL = ' + YAPI_LOGIN_BASE_URL);
logger.info('[config] YAPI_IOT_BASE_URLORT = ' + YAPI_IOT_BASE_URL);
logger.info('[config] YAPI_OAUTH_BASE_URL = ' + YAPI_OAUTH_BASE_URL);
logger.info('[config] YAPI_OAUTH_REDIRECT_URL = ' + YAPI_OAUTH_REDIRECT_URL);
logger.info('[config] YAPI_CLIENT_ID = ' + Boolean(YAPI_CLIENT_ID?.length));
logger.info('[config] YAPI_CLIENT_SECRET = ' + Boolean(YAPI_CLIENT_SECRET?.length));
logger.info('[config] CACHE_TTL = ' + CACHE_TTL);
logger.info('[config] JWT_MAX_AGE = ' + JWT_MAX_AGE);
logger.info('[config] STAT_BATCH_SIZE = ' + STAT_BATCH_SIZE);
logger.info('[config] DB_STORAGE_PATH = ' + DB_STORAGE_PATH);
logger.info('[config] MEDIA_STORAGE_PATH = ' + MEDIA_STORAGE_PATH);