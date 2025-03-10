import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
    constructor(message?: string) {
        super(message ?? 'Unauthorized');
    }
}