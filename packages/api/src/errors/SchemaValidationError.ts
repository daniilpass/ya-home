import { ValidationError } from 'jsonschema';

import { AppError } from './AppError';

export class SchemaValidationError extends AppError {
    errors: ValidationError[];

    constructor(erros: ValidationError[], message?: string) {
        super(message || 'Schema is invalid');
        this.errors = erros;
    }
}
