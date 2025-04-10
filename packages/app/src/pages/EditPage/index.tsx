import React from 'react';

export default React.lazy(
    () => import('./EditPage').then(({ EditPage }) => ({ default: EditPage }))
);
