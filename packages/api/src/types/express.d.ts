import type { RequestUserInfo } from '../services/authService';

declare global {
    namespace Express {
        interface Request {
            userInfo?: Partial<RequestUserInfo>
        }
    }
}