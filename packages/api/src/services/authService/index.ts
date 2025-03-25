import { authByCode, verifyAuth, refreshAuth } from './AuthService';
export * from './errors';
export * from './types';

export default {
    authByCode,
    verifyAuth,
    refreshAuth,
};