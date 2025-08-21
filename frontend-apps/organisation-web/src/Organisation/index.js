import React from 'react';

import { withAuthenticationRequired } from "@auth0/auth0-react";
import { ResourceProvider } from 'components/Resource';

import Org from './v2';
import { OrganisationProvider } from './v2/context';

export const Organisation = withAuthenticationRequired(() => {
    return (
        <ResourceProvider scope="org">
            <OrganisationProvider>
                <Org />
            </OrganisationProvider>
        </ResourceProvider>
    );
});

export default Organisation;