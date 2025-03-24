import { RequestUserInfo, UserJwt } from './auth';

declare global {
    namespace Express {
        interface Request {
            userInfo?: RequestUserInfo
        }
    }
}