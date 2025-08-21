import React, { Suspense, lazy } from 'react';

import { withAuthenticationRequired } from "@auth0/auth0-react";
// import { client as elevioClient } from 'elevio';
// import Elevio from 'elevio/lib/react';
// import { AlertProvider } from 'components/AlertProvider'
import { DashboardOutline } from 'components/Outline';
import { ResourceProvider } from 'components/Resource';
import { Outlet, Route, Routes } from 'react-router-dom';

import { EntityProvider } from './v2/context';

const Home = lazy(() => import('./v2/List'));
const Profile = lazy(() => import('./v2/Entity'));
const EditDetails = lazy(() => import('./v2/Entity/Details/Edit'));
const EditNature = lazy(() => import('./v2/Entity/Nature/Edit'));

export const Customer = withAuthenticationRequired(() => {

    // The :id route is duplicated to allow for the nested routes to render properly
    // see: https://github.com/ReactTraining/react-router/issues/7239
    return (
        <ResourceProvider scope="customers">
            {/* <AlertProvider> */}
                <EntityProvider>
                    <Suspense fallback={<DashboardOutline visible={true} />}>
                        <Routes>
                            <Route path="risk-:risk" element={<Home />} />
                            <Route path="add" element={<EditDetails />} />
                            <Route path=":id" element={<Profile />} />
                            <Route path=":id" element={<Outlet />} >
                                <Route path="details" element={<EditDetails />} />
                                <Route path="nature/:step" element={<EditNature />} />
                                <Route path="nature" element={<EditNature />} />
                            </Route>
                            <Route path="/*" element={<Home />} />
                        </Routes>
                    </Suspense>
                </EntityProvider>
            {/* </AlertProvider> */}
        </ResourceProvider>
    );
});

export default Customer;

export { EntityList as CustomerList } from './v2/List';
export { ListBody as CustomerListBody } from './v2/List/ListBody';
export { RiskSummary } from './v2/RiskSummary';