import { Request, Response, NextFunction} from "express";
import { AppError } from '../errors/AppError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const getErrorStatusCode = (err: Error) => {
    switch ((err as Object).constructor) {
        case NotFoundError:
            return 404;
        case AppError:
            return 400;
        default:
            return 500;
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(getErrorStatusCode(err));
    res.json({ error: err.message, stack: err.stack });
}