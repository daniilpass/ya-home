import React from 'react';

export default React.lazy(
    () => import('./MainPage').then(({ MainPage }) => ({ default: MainPage }))
);
