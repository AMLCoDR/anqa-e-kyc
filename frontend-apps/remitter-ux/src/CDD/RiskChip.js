import React from 'react';

import Chip from '@material-ui/core/Chip';

const RiskChip = props => {
    const { risk, onClick } = props;

    const riskLabel = ['Set Risk', 'Low', 'Medium', 'High'];
    const riskColour = ['default', 'success', 'warning', 'error'];

    return (
        <Chip
            label={riskLabel[risk]}
            color={riskColour[risk]}
            sx={{ width: 80 }}
            onClick={onClick}
        />
    );
};

export default RiskChip;