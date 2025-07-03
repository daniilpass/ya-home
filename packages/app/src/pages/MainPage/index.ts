import React from 'react';

export * from './loader';

export default React.lazy(
    () => import('./MainPage').then(({ MainPage }) => ({ default: MainPage }))
);