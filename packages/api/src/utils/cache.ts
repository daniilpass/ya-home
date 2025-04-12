import NodeCache from 'node-cache';

import { CACHE_TTL } from '../constants';

export const cache = new NodeCache({
    stdTTL: CACHE_TTL,
});
