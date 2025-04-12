import { Request, Response } from "express";
import { AppError } from '../errors/AppError';
import { NotFoundError } from '../errors/NotFoundError';
import { SchemaValidationError } from '../errors/SchemaValidationError';
import { UnauthorizedError } from '../errors/UnauthorizedError';

type ErrorJson = {
    error: string;
    stack?: string;
    [key: string]: unknown;
}

const getErrorStatusCode = (error: Error): number => {
    switch (true) {
        case error instanceof UnauthorizedError:
            return 401;
        case error instanceof NotFoundError:
            return 404;
        case error instanceof AppError:
            return 400;
        default:
            return 500;
    }
}

const getErrorJson = (error: Error): ErrorJson => {
    switch (true) {
        case error instanceof SchemaValidationError:            
            return { 
                error: error.message,
                schemaErrors: (error as SchemaValidationError).schemaErrorsShort,
            };
        case error instanceof AppError:
            return { error: error.message };
        default:
            return { error: error.message, stack: error.stack };
    }
}

export const errorHandler = (error: Error, _req: Request, res: Response) => {
    res.status(getErrorStatusCode(error));
    res.json(getErrorJson(error));
}