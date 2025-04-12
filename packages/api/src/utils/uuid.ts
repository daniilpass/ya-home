import { v4 as uuid4, validate } from 'uuid';

export const uuid = {
    new: uuid4,
    validate,
};