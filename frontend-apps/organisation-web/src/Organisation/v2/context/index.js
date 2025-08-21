import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import instana from 'components/Instana';

import config from '../../../config';
import { ReportingEntityServiceClient } from '../../../proto/reportingentity/v2/reporting_entity_grpc_web_pb';
import { GetRequest, UpdateRequest, ReportingEntity } from '../../../proto/reportingentity/v2/reporting_entity_pb';

export const initialState = {
    initialised: false,
    pending: false,
    organisation: {},
    draft: {},
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'init':
            return { ...state, pending: true };
        case 'fetch':
            return { ...state, initialised: true, pending: false, organisation: action.payload };
        case 'update':
            return { ...state, pending: false, organisation: action.payload, draft: {} };
        case 'update-draft':
            return { ...state, draft: action.payload };
        case 'error':
            instana.error(action.error.message, action.meta);
            console.error(action.error);
            return { ...state, error: action.error };
        default:
            throw new Error('Unknown action type in organisation reducer:' + action.type);
    }
};

const OrganisationContext = createContext(initialState);

export const OrganisationProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <OrganisationContext.Provider value={{ state, dispatch }}>
            {props.children}
        </OrganisationContext.Provider>
    );
};

const orgSvc = new ReportingEntityServiceClient(config.apiUrl);

export const useOrganisation = () => {
    const [localState, localDispatch] = useReducer(reducer, initialState);
    let context = useContext(OrganisationContext);
    if (context.state === undefined) {
        context = { state: localState, dispatch: localDispatch };
    }
    const { state, dispatch } = context;
    const { getAccessTokenSilently } = useAuth0();

    // Get the organisation matching the user's tenant
    const fetch = useCallback(async () => {
        dispatch({ type: 'init' });
        const req = new GetRequest();
        orgSvc.get(
            req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, res) => {
                if (!err) {
                    dispatch({ type: 'fetch', payload: res.getReportingEntity().toObject() });
                } else {
                    dispatch({ type: 'error', error: err, meta: { method: 'fetch' } });
                }
            }
        );
    }, [dispatch, getAccessTokenSilently]);

    useEffect(() => {
        if (!state.initialised) {
            fetch();
        }
    }, [state.initialised, fetch]);

    // Update an existing organisation
    const update = async (org) => {
        dispatch({ type: 'init' });

        const o = new ReportingEntity();
        o.setName(org.name);
        o.setTradingAs(org.tradingAs);
        o.setBusinessNumber(org.businessNumber);
        o.setOrgType(org.orgType);
        o.setSize(org.size);
        o.setAddress(org.address);
        o.setCity(org.city);
        o.setRegion(org.region);
        o.setPostCode(org.postCode);
        o.setCountry(org.country)
        o.setPhoneNumber(org.phoneNumber);;
        o.setWebsiteUri(org.websiteUri);
        o.setContactName(org.contactName);
        o.setContactPhone(org.contactPhone);
        o.setContactEmail(org.contactEmail);
        o.setNature(org.nature);
        o.setUseOfId(org.useOfId);
        o.setAgreeInfoSecurity(org.agreeInfoSecurity);
        o.setAgreeRiskManagement(org.agreeRiskManagement);
        o.setHasBreachProcess(org.hasBreachProcess);
        o.setHasPrivacyPolicy(org.hasPrivacyPolicy);
        o.setNzBreach(org.nzBreach);
        o.setNzBreachDetail(org.nzBreachDetail);
        o.setNzBreachMitigation(org.nzBreachMitigation);
        o.setAusBreach(org.ausBreach);
        o.setAusBreachDetail(org.ausBreachDetail);
        o.setAusBreachMitigation(org.ausBreachMitigation);
        o.setAusAutoPrivacy(org.ausAutoPrivacy);
        o.setSeekConsent(org.seekConsent);
        o.setHasConsentWording(org.hasConsentWording);
        o.setPrivacyPolicyDocId(org.privacyPolicyDocId);
        o.setConsentFormDocId(org.consentFormDocId);

        const req = new UpdateRequest();
        req.setReportingEntity(o);

        orgSvc.update(
            req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, res) => {
                if (!err) {
                    dispatch({ type: 'update', payload: res.getReportingEntity().toObject() });
                } else {
                    dispatch({ type: 'error', error: err, meta: { method: 'update' } });
                }
            }
        );
    };

    // Save/Update a local draft but don't update the server yet.
    const saveDraft = useCallback((org, privacyFile, consentFile) => {
        dispatch({ type: 'update-draft', payload: { org, privacyFile, consentFile } });
    }, [dispatch]);

    return { state, update, saveDraft };
};

