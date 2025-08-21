import React, { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import Loader from '../Viewport/Loader';
import Viewport from '../Viewport';
import AppRoutes from './AppRoutes';

const Certifier = props => {
    return (
        <BrowserRouter>
            <Viewport>
                <Suspense fallback={<Loader />}>
                    <AppRoutes />
                </Suspense>
            </Viewport>
        </BrowserRouter>
    );
};

export default Certifier;

