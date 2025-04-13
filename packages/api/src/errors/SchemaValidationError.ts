import type { ValidationError } from 'jsonschema';

import { AppError } from './AppError';

export class SchemaValidationError extends AppError {
    schemaErrors: ValidationError[];
    schemaErrorsShort: Pick<ValidationError, 'argument' | 'message' | 'path'>[];

    constructor(schemaErrors: ValidationError[], message?: string) {
        super(message || 'Schema is invalid');
        this.schemaErrors = schemaErrors;
        this.schemaErrorsShort = schemaErrors.map(({ argument, message, path }) => ({ argument, message, path }));
    }
}
