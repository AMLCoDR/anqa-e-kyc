import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import instana from 'components/Instana';
import cloneDeep from 'lodash.clonedeep';

import config from '../../../config';
import { CustomerServiceClient } from '../../../proto/customer/v1beta1/customer_grpc_web_pb';
import { Customer, AddRequest, GetRequest, UpdateRequest, DeleteRequest } from '../../../proto/customer/v1beta1/customer_pb';

export const initialState = {
    pending: false,
    customers: [],
    matches: 0,
    customer: null,
    risks: [],
    error: null,
};

const reducer = (state, action) => {
    const newState = cloneDeep(state);
    switch (action.type) {
        case 'init':
            const { customerId } = action.payload || {}
            newState.pending = true;
            newState.customer = customerId ? newState.customers.find(e => e.getId() === customerId) : null;
            newState.error = null;
            return newState;
        case 'add':
            newState.pending = false;
            newState.customer = action.payload;
            newState.customers.push(action.payload)
            return newState;
        case 'get':
            newState.pending = false;
            newState.customer = action.payload;
            return newState;
        case 'update': {
            newState.pending = false;
            newState.customer = action.payload;
            const index = newState.customers.findIndex(e => e.getId() === action.payload);
            newState.customers.splice(index, 1, action.payload);
            return newState;
        }
        case 'delete': {
            newState.pending = false;
            const index = newState.customers.findIndex(e => e.getId() === action.payload);
            newState.customers.splice(index, 1);
            newState.matches--;
            return newState;
        }
        case 'clear': {
            newState.pending = false;
            newState.customer = new Customer();
            return newState;
        }
        case 'error':
            instana.error(action.error.message, action.meta);
            console.error(action.error);
            newState.pending = false;
            newState.error = action.error.message;
            return newState;
        default:
            throw new Error('Unknown action type in customer reducer');
    }
};

export const CustomerContext = createContext(initialState);

export const CustomerProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <CustomerContext.Provider value={{ state, dispatch }}>
            {props.children}
        </CustomerContext.Provider>
    );
};

const customerSvc = new CustomerServiceClient(config.apiUrl);

export const useCustomer = () => {
    const [localState, localDispatch] = useReducer(reducer, initialState);
    let context = useContext(CustomerContext);
    if (context.state === undefined) {
        context = { state: localState, dispatch: localDispatch };
    }
    const { state, dispatch } = context;
    const { getAccessTokenSilently } = useAuth0();

    const add = useCallback(async (customer) => {
        dispatch({ type: 'init' });

        const req = new AddRequest();
        req.setCustomer(customer);

        customerSvc.add(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'add' } });
                } else {
                    dispatch({ type: 'add', payload: rsp.getCustomer() });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const get = useCallback(async (customerId) => {
        dispatch({ type: 'init', payload: { customerId } });

        const req = new GetRequest();
        req.setCustomerId(customerId);
        req.setDegrees(1);

        customerSvc.get(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'get' } });
                } else {
                    dispatch({ type: 'get', payload: rsp.getCustomer() });
                }
            }
        );
    }, [getAccessTokenSilently, dispatch]);

    const update = useCallback(async (customer) => {
        dispatch({ type: 'init' });

        const req = new UpdateRequest();
        req.setCustomer(customer);

        customerSvc.update(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'update' } });
                } else {
                    dispatch({ type: 'update', payload: customer });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);


    // TODO: get riskSummary from customer service
    // const riskSummary = useCallback(async () => {
    //     dispatch({ type: 'init' });
    //     const req = new RiskSummaryRequest();
    //     customerSvc.riskSummary(req,
    //         { Authorization: 'Bearer ' + await getAccessTokenSilently() },
    //         (err, rsp) => {
    //             if (err) {
    //                 dispatch({ type: 'error', error: err, meta: { method: 'riskSummary' } });
    //             } else {
    //                 dispatch({ type: 'riskSummary', payload: rsp.getRisksList() });
    //             }
    //         },
    //     );
    // }, [getAccessTokenSilently, dispatch]);

    const deleteCustomer = useCallback(async (customerId) => {
        dispatch({ type: 'init' });

        const req = new DeleteRequest();
        req.setCustomerId(customerId);

        customerSvc.delete(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'delete' } });
                } else {
                    dispatch({ type: 'delete', payload: customerId });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const clear = useCallback(async () => {
        dispatch({ type: 'clear' });
    }, [dispatch]);

    return { state, add, get, update, /*riskSummary,*/ deleteCustomer, clear };
};
