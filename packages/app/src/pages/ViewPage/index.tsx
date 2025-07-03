import React from 'react';

export * from './loader';

export default React.lazy(
    () => import('./ViewPage').then(({ ViewPage }) => ({ default: ViewPage }))
);
