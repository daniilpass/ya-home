import React from 'react';

export default React.lazy(
    () => import('./NotFoundPage').then(({ NotFoundPage }) => ({ default: NotFoundPage }))
);
