import React, { forwardRef } from 'react';

import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const ActionLink = forwardRef((props, ref) => {
    const { to } = props;
    if (!to.startsWith("/")) {
        return <Link ref={ref} target="_blank" rel="noopener" href={to} {...props} />;
    }
    if (to.includes("#")) {
        return <HashLink {...props} />;
    }
    return <RouterLink ref={ref} {...props} />;
});

export default ActionLink;