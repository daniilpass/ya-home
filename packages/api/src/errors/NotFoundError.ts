import { AppError } from './AppError';

export class NotFoundError extends AppError {
    constructor(message?: string) {
        super(message ?? 'Entity not found');
    }
}
