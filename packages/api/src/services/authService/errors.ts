import { UnauthorizedError } from '../../errors/UnauthorizedError';

export class TokenMissingError extends UnauthorizedError {
    constructor() {
        super('Token is missing');
    }
}

export class JwtMissingError extends UnauthorizedError {
    constructor() {
        super('User JWT is missing');
    }
}
