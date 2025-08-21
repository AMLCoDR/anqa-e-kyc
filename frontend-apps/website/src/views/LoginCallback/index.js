import React, { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

import config from '../../config';

export const LoginCallback = () => {
    const { isLoading, isAuthenticated } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                window.location.replace(config.appUrl);
            } else {
                history.replace('/');
            }
        }
    }, [isLoading, isAuthenticated, history]);

    return (
        <></>
    );
}