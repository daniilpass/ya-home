import React from 'react';

export default React.lazy(
    () => import('./ViewPage').then(({ ViewPage }) => ({ default: ViewPage }))
);
