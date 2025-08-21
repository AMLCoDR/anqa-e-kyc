import React, { lazy } from 'react';

import { useRoutes } from 'react-router-dom';

const Home = lazy(() => import('../Home'));

const AppRoutes = () => {
    const routes = [
        { path: '/', element: <Home /> }
    ];

    return useRoutes(routes);
};

export default AppRoutes;