import React from 'react';

import { Auth0Provider } from '@auth0/auth0-react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { App } from './App';
import config from './config';
import * as serviceWorker from './serviceWorker';

ReactGA.initialize(config.ga.code);


ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain={config.auth0.domain}
            clientId={config.auth0.clientId}
            audience={config.auth0.audience}
            redirectUri={window.location.origin + '/callback'}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();