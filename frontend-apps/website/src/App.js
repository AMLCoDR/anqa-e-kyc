import React, { lazy, Suspense } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { unstable_createMuiStrictModeTheme as createTheme } from '@material-ui/core/styles';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AlertProvider } from './components/AlertProvider'
import { WaitSkeleton } from './components/WaitSkeleton';
// import config from './config';
import custom from './theme';
import { Layout } from './views/Layout';

const Signup = lazy(() => import('./views/Account/Signup'));
// const Payment = lazy(() => import('./views/Account/Payment'));
const Content = lazy(() => import('./views/Content'));
const LoginCallback = lazy(() => import('./views/LoginCallback'));

let theme = createTheme(custom);
theme = responsiveFontSizes(theme);

export const App = () => {
    // const stripePromise = loadStripe(config.stripe.key);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<WaitSkeleton variant="default" />}>
                <AlertProvider>
                    <Router>
                        <Layout>
                            <Switch>

                                <Route exact path="/signup/:token" component={Signup} />
                                <Route exact path="/payment/:planId" component={Signup} />
                                {/* <Route exact path="/payment/:planId" render={() =>
                                    <Elements stripe={stripePromise}>
                                        <Payment />
                                    </Elements>
                                } /> */}
                                <Route exact path="/" component={Content} />
                                <Route exact path="/callback" component={LoginCallback} />
                                <Route exact path="/:slug" component={Content} />
                                <Route exact path="/:type/:slug" component={Content} />
                            </Switch>
                        </Layout>
                    </Router>
                </AlertProvider>
            </Suspense>
        </ThemeProvider>
    );
}
