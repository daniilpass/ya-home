import { Request, Response, NextFunction} from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.json({ error: err.message });
}