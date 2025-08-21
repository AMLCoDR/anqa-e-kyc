import * as React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { Controller, appRoutes } from './Controller';
import { DataProvider } from './Datasource';
import theme from './theme';
import Viewport from './Viewport';

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Controller>
                    <DataProvider>
                        <Viewport>
                            <AppRoutes />
                        </Viewport>
                    </DataProvider>
                </Controller>
            </BrowserRouter>
        </ThemeProvider>
    );
}

const AppRoutes = () => {
    return useRoutes(appRoutes());
}

export default App;
