import React from 'react';

import MFE, { useRemote } from '../remotes';
import Certifier from './Certifier';

const App = () => {
    const shell = useRemote('shell', './Shell');

    return (
        <MFE mfe={shell}>
            <Certifier />
        </MFE>
    );
};

export default App;
