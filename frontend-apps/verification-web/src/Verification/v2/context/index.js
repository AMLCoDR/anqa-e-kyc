import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import instana from 'components/Instana';
import cloneDeep from 'lodash.clonedeep';
import mixpanel from 'mixpanel-browser';

// import config from 'react-global-configuration';
import config from '../../../config';
import { IdCheckServiceClient } from '../../../proto/idcheck/v2/id_check_grpc_web_pb.js';
import {
    GetRequest, CheckRequest, IdCheck, IdType, Status,
    Passport, Licence, Address, NationalId, Watchlist
} from '../../../proto/idcheck/v2/id_check_pb.js';

export const initialState = {
    pending: {},
    idChecks: {},
    error: {},
};

const createWatchlistCheck = () => {
    const idCheck = new IdCheck();
    idCheck.setIdType(IdType.ID_TYPE_WATCHLIST);
    idCheck.setStatus(Status.STATUS_UNCHECKED);
    return idCheck;
}

const reducer = (state, action) => {
    const newState = cloneDeep(state);
    switch (action.type) {
        case 'init':
            newState.pending = {};
            newState.error = {};
            newState.idChecks = {
                [IdType.ID_TYPE_WATCHLIST]: createWatchlistCheck()
            };
            return newState;
        case 'clear':
            newState.pending = {};
            newState.error = {};
            newState.idChecks = {}
            return newState;
        case 'fetch':
            newState.idChecks = {};
            action.payload.getChecksList().forEach(check =>
                newState.idChecks[check.getIdType()] = check
            );

            // add new EDD check if not exists 
            if (!newState.idChecks[IdType.ID_TYPE_WATCHLIST]) {
                newState.idChecks[IdType.ID_TYPE_WATCHLIST] = createWatchlistCheck();
            }

            newState.pending = {};
            return newState;
        case 'verify':
            newState.pending[action.payload] = true;
            return newState;
        case 'update':
            const updateType = action.payload.getIdType();
            newState.idChecks[updateType] = action.payload;
            newState.pending[updateType] = false;
            newState.error[updateType] = null;
            return newState;
        case 'add':
            const addType = action.payload.getIdType();
            newState.idChecks[addType] = action.payload;
            newState.pending[addType] = false;
            newState.error[addType] = null;
            return newState;
        case 'error':
            instana.error(action.error.message, action.meta);
            console.error(action.error);
            newState.pending[action.payload] = false;
            newState.error[action.payload] = action.error;
            return newState;
        default:
            throw new Error('Unknown action type in idCheck reducer');
    }
};

const VerificationContext = createContext(initialState);

const VerificationProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <VerificationContext.Provider value={{ state, dispatch }}>
            {props.children}
        </VerificationContext.Provider>
    );
};

const idSvc = new IdCheckServiceClient(config.apiUrl);

export const useVerification = () => {
    const context = useContext(VerificationContext);
    if (context === undefined) {
        throw new Error('useVerification must be used within a verificationProvider');
    }
    const { state, dispatch } = context;
    const { getAccessTokenSilently } = useAuth0();

    const clear = useCallback(async () => {
        dispatch({ type: 'clear' });
    }, [dispatch]);

    const fetch = useCallback(async (entityId) => {
        dispatch({ type: 'init' });
        const req = new GetRequest();
        req.setEntityId(entityId);

        idSvc.get(req,
            { Authorization: `Bearer ${await getAccessTokenSilently()}` },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', payload: err, meta: { method: 'fetch' } });
                } else {
                    dispatch({ type: 'fetch', payload: rsp });
                }
            });
    }, [getAccessTokenSilently, dispatch]);

    const add = useCallback(async (idType) => {
        const idCheck = new IdCheck();
        idCheck.setIdType(idType);
        idCheck.setStatus(Status.STATUS_UNCHECKED);

        dispatch({ type: 'add', payload: idCheck });
    }, [dispatch]);

    const verify = useCallback(async (checkType, entityId, params) => {
        dispatch({ type: 'verify', payload: checkType });

        const req = new CheckRequest();
        req.setEntityId(entityId);

        switch (parseInt(checkType)) {
            case IdType.ID_TYPE_PASSPORT:
                const p = new Passport();
                p.setNumber(params.number);
                p.setExpiry(params.expiry);
                req.setPassport(p);
                mixpanel.track('Passport check');
                break;
            case IdType.ID_TYPE_LICENCE:
                const l = new Licence();
                l.setNumber(params.number);
                l.setVersion(params.version);
                req.setLicence(l);
                mixpanel.track('Driver licence check');
                break;
            case IdType.ID_TYPE_ADDRESS:
                const a = new Address();
                a.setUnitNumber(params.unitNumber);
                a.setStreetNumber(params.streetNumber);
                a.setStreetName(params.streetName);
                a.setStreetType(params.streetType);
                a.setSuburb(params.suburb);
                a.setCity(params.city);
                // a.setPostCode(params.postCode);
                req.setAddress(a);
                mixpanel.track('Address check');
                break;
            case IdType.ID_TYPE_NATIONALID:
                const n = new NationalId();
                n.setNumber(params.number);
                req.setNationalId(n);
                mixpanel.track('National ID check');
                break;
            case IdType.ID_TYPE_WATCHLIST:
                const w = new Watchlist();
                req.setWatchlist(w);
                mixpanel.track('EDD check');
                break;
            default:
                return;
        }

        idSvc.check(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'check' }, payload: checkType });
                } else {
                    dispatch({ type: 'update', payload: rsp.getIdCheck() });
                }
            }
        );
    }, [getAccessTokenSilently, dispatch]);

    return { state, fetch, add, verify, clear };
};

export default VerificationProvider;
