import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

import jwt from 'jsonwebtoken';
import { useNavigate, useLocation, matchRoutes } from 'react-router-dom';

import CDD from '../CDD';
import CDDPerson from '../CDD/CDDPerson';
import CreateCustomer from '../Customer/CreateLink';
import CustomerCreated from '../Customer/LinkCreated';
import CustomerOnboarder from '../Customer/Onboarder';
import CoHome from '../Home';
import CsHome from '../Home/Cs';
import SelfOnboarder from '../KycCertifier/SelfOnboarder';
import AddPerson from '../Person/AddPerson';
import InvitePerson from '../Person/Invite';
import PersonInvited from '../Person/Invited';
import PersonOnboarder from '../Person/Onboarder';

const token = () => {
    // See: https://auth0.com/learn/token-based-authentication-made-easy/
    return jwt.sign({ username: "ado" }, 'supersecret', { expiresIn: 120 });
}

const routes = [
    { path: "/customer/create", element: <CreateCustomer />, next: '/customer/created' },
    { path: "/customer/created", element: <CustomerCreated />, next: `/customer/onboarder/self?jwt=${token()}` },
    { path: "/customer/onboarder/:init", element: <CustomerOnboarder />, },

    { path: "/person/add", element: <AddPerson /> },
    { path: "/person/invite", element: <InvitePerson />, next: '/person/invited' },
    { path: "/person/invited", element: <PersonInvited />, next: `/person/onboarder/self?jwt=${token()}` },
    { path: "/person/onboarder/scan", element: <SelfOnboarder /> },
    { path: "/person/onboarder/:init", element: <PersonOnboarder /> },

    { path: "/cdd", element: <CDD /> }, // In real app we'd need a customer ID
    { path: "/cdd/:custId", element: <CDD /> },
    { path: "/cdd/:custId/person/:id", element: <CDDPerson /> },

    { path: "/co", element: <CoHome /> },
    { path: "/cs", element: <CsHome /> },
    { path: "/", element: <CsHome /> }
];

const stack = [];

const reducer = (state, action) => {
    switch (action.type) {
        case 'init':
            return state;
        case 'addCustomer':
            state.customer = action.payload;
            return state;
        case 'addPerson':
            state.people.push(action.payload);
            return state;
        case 'get':
        case 'update':
        case 'delete':
        case 'error':
        default:
            throw new Error('Unknown action type in document reducer');
    }
};

const initialState = {
    pending: false,
    error: null,
};

const ControllerContext = createContext(initialState);

export const Controller = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ControllerContext.Provider value={{ state, dispatch }}>
            {props.children}
        </ControllerContext.Provider>
    );
}

export const appRoutes = () => {
    return routes;
}

export const useView = () => {
    let context = useContext(ControllerContext);
    if (context.state === undefined) {
        throw new Error("useData should only be used within the scope of DataProvider")
    }
    // const { state, dispatch } = context;
    // const [data] = useData();
    const navigate = useNavigate();
    const location = useLocation();

    const back = useCallback(() => {
        const path = stack.pop();
        navigate(path);
    }, [navigate]);

    const next = useCallback(() => {
        const matches = matchRoutes(routes, location);
        stack.push(location.pathname);
        navigate(matches[0].route.next);
    }, [navigate, location]);

    const start = useCallback((path) => {
        const matches = matchRoutes(routes, location);
        stack.length = 0;
        stack.push(location.pathname);
        navigate(path || matches[0].route.next);
    }, [navigate, location]);

    const exit = useCallback(() => {
        let path = "/";
        if (stack.length > 0) {
            path = stack[0];
        }
        stack.length = 0;
        navigate(path);

    }, [navigate]);

    const actions = useMemo(() => {
        return { exit, back, next, start }
    }, [exit, back, next, start]);

    return actions;
}