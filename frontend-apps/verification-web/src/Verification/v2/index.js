import React from 'react';

import * as PropTypes from 'prop-types';

import VerificationProvider from "./context";
import EddCard from "./EddCard";
import CheckCard from "./IdCard";

const Verification = ({ entity }) => {
    return (
        <VerificationProvider>
            <CheckCard entity={entity} />
            <EddCard entity={entity} />
        </VerificationProvider>
    );
};

Verification.propTypes = {
    entity: PropTypes.object,
};

export default Verification;