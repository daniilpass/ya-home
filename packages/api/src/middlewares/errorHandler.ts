import { Request, Response, NextFunction} from "express";
import { AppError } from '../errors/AppError';
import { NotFoundError } from '../errors/NotFoundError';
import { SchemaValidationError } from '../errors/SchemaValidationError';

type ErrorJson = {
    error: string;
    stack?: string;
    [key: string]: unknown;
}

const getErrorStatusCode = (err: Error): number => {
    switch ((err as Object).constructor) {
        case NotFoundError:
            return 404;
        case SchemaValidationError:
        case AppError:
            return 400;
        default:
            return 500;
    }
}

const getErrorJson = (err: Error): ErrorJson => {
    switch ((err as Object).constructor) {
        case SchemaValidationError:
            const validationErrors = (err as SchemaValidationError)
                .errors
                .map(e => ({
                    argument: e.argument,
                    message: e.message,
                    path: e.path,
                }));
            
            return { 
                error: err.message,
                validationErrors,
            };
        case NotFoundError:
        case AppError:
            return { error: err.message };
        default:
            return { error: err.message, stack: err.stack };
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(getErrorStatusCode(err));
    res.json(getErrorJson(err));
}