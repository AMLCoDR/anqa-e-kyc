import React from 'react';

import { withAuthenticationRequired } from "@auth0/auth0-react";
// import { useFlags } from 'launchdarkly-react-client-sdk';
import * as PropTypes from 'prop-types';

import VerificationV2 from './v2';

const Verification = withAuthenticationRequired(({ entity }) => {
    // const { dataZooV2 } = useFlags();

    return <VerificationV2 entity={entity} />;
});

Verification.propTypes = {
    entity: PropTypes.object,
};

export default Verification;