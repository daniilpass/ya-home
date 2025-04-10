import React from 'react';

export default React.lazy(
    () => import('./AuthPage').then(({ AuthPage }) => ({ default: AuthPage }))
);
