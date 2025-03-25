import { RequestUserInfo } from './auth';

declare global {
    namespace Express {
        interface Request {
            userInfo?: Partial<RequestUserInfo>
        }
    }
}