import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import instana from 'components/Instana';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb.js';
import cloneDeep from 'lodash.clonedeep';

import config from '../../../config';
import { EntityServiceClient } from '../../../proto/entity/v1/entity_grpc_web_pb';
import {
    Entity, AddRequest, QueryRequest, GetRequest, UpdateRequest,
    SetRiskRequest, DeleteRequest, Relationship, LinkRequest, UnlinkRequest
} from '../../../proto/entity/v1/entity_pb';

export const initialState = {
    pending: false,
    entities: [],
    matches: 0,
    entity: null,
    risks: [],
    error: null,
};

const reducer = (state, action) => {
    const newState = cloneDeep(state);
    switch (action.type) {
        case 'init':
            const { entityId } = action.payload || {}
            newState.pending = true;
            newState.entity = entityId ? newState.entities.find(e => e.getId() === entityId) : null;
            newState.error = null;
            return newState;
        case 'add':
            newState.pending = false;
            newState.entity = action.payload;
            newState.entities.push(action.payload)
            return newState;
        case 'query':
            newState.pending = false;
            newState.entities = action.payload.getDataList();
            newState.matches = action.payload.getMatches();
            return newState;
        case 'get':
            newState.pending = false;
            newState.entity = action.payload;
            return newState;
        case 'update': {
            newState.pending = false;
            newState.entity = action.payload;
            const index = newState.entities.findIndex(e => e.getId() === action.payload);
            newState.entities.splice(index, 1, action.payload);
            return newState;
        }
        case 'updateRisk': {
            newState.entity.setRisk(action.payload);
            let entities = newState.entities;
            const index = entities.findIndex(c => c.getId() === newState.entity.getId())
            entities.splice(index, 1, newState.entity);
            newState.pending = false;
            newState.entities = entities;
            return newState;
        }
        case 'riskSummary': {
            newState.pending = false;
            newState.risks = action.payload;
            return newState;
        }
        case 'link': {
            newState.pending = false;
            newState.entity.getRelatedPartiesList().push(action.payload);
            return newState;
        }
        case 'unlink': {
            newState.pending = false;
            const id = action.payload.getTargetEntity().getId();
            const index = newState.entity.getRelatedPartiesList().findIndex(rp =>
                rp.getTargetEntity().getId() === id
            );
            newState.entity.getRelatedPartiesList().splice(index, 1);
            return newState;
        }
        case 'delete': {
            newState.pending = false;
            const index = newState.entities.findIndex(e => e.getId() === action.payload);
            newState.entities.splice(index, 1);
            newState.matches--;
            return newState;
        }
        case 'clear': {
            newState.pending = false;
            newState.entity = new Entity();
            return newState;
        }
        case 'error':
            instana.error(action.error.message, action.meta);
            console.error(action.error);
            newState.pending = false;
            newState.error = action.error.message;
            return newState;
        default:
            throw new Error('Unknown action type in entity reducer');
    }
};

export const EntityContext = createContext(initialState);

export const EntityProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <EntityContext.Provider value={{ state, dispatch }}>
            {props.children}
        </EntityContext.Provider>
    );
};

const entitySvc = new EntityServiceClient(config.apiUrl);

// TODO:
// - create separate customer update
// - add/remove customer when 'Make Customer' button clicked

export const useEntity = () => {
    const [localState, localDispatch] = useReducer(reducer, initialState);
    let context = useContext(EntityContext);
    if (context.state === undefined) {
        context = { state: localState, dispatch: localDispatch };
    }
    const { state, dispatch } = context;
    const { getAccessTokenSilently } = useAuth0();

    const add = useCallback(async (entity) => {
        dispatch({ type: 'init' });

        const req = new AddRequest();
        req.setEntity(entity);

        entitySvc.add(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'add' } });
                } else {
                    dispatch({ type: 'add', payload: rsp.getEntity() });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    // TODO: add filter by customer
    const query = useCallback(async (filter = { isCustomer: true }, page = { offset: 0, limit: 50 }, callback) => {
        if (!callback) {
            dispatch({ type: 'init' });
        }

        const req = new QueryRequest();
        req.setSearchText(filter.searchText);
        if (filter.risk) {
            req.setValue(filter.risk);
        }
        req.setRule(filter.rule);
        req.setIsCustomer(filter.isCustomer);
        req.setOffset(page.offset);
        req.setLimit(page.limit);

        entitySvc.query(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (callback) {
                    callback(err, rsp);
                } else {
                    if (err) {
                        dispatch({ type: 'error', error: err, meta: { method: 'query' } });
                    } else {
                        dispatch({ type: 'query', payload: rsp });
                    }
                }
            }
        );
    }, [getAccessTokenSilently, dispatch]);

    const get = useCallback(async (entityId) => {
        dispatch({ type: 'init', payload: { entityId } });

        const req = new GetRequest();
        req.setEntityId(entityId);
        req.setDegrees(1);

        entitySvc.get(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'get' } });
                } else {
                    dispatch({ type: 'get', payload: rsp.getEntity() });
                }
            }
        );
    }, [getAccessTokenSilently, dispatch]);

    const update = useCallback(async (entity) => {
        dispatch({ type: 'init' });

        const req = new UpdateRequest();
        req.setEntity(entity);

        entitySvc.update(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'update' } });
                } else {
                    dispatch({ type: 'update', payload: entity });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const updateRisk = useCallback(async (risk) => {

        const req = new SetRiskRequest();
        req.setEntityId(state.entity.getId());
        req.setRisk(risk);

        entitySvc.setRisk(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'updateRisk' } });
                } else {
                    dispatch({ type: 'updateRisk', payload: risk });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch, state.entity]);

    const deleteEntity = useCallback(async (entityId) => {
        dispatch({ type: 'init' });

        const req = new DeleteRequest();
        req.setEntityId(entityId);

        entitySvc.delete(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'delete' } });
                } else {
                    dispatch({ type: 'delete', payload: entityId });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const link = useCallback(async (srcEntity, tgtEntity, relType) => {
        const rel = new Relationship();
        rel.setSourceEntity(srcEntity);
        rel.setTargetEntity(tgtEntity);
        rel.setType(relType);

        const req = new LinkRequest();
        req.setRelationship(rel);

        entitySvc.link(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'link' } });
                } else {
                    dispatch({ type: 'link', payload: rel });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const unlink = useCallback(async (srcEntity, tgtEntity, relType) => {
        const rel = new Relationship();
        rel.setSourceEntity(srcEntity);
        rel.setTargetEntity(tgtEntity);
        rel.setType(relType);

        const req = new UnlinkRequest();
        req.setRelationship(rel);

        entitySvc.unlink(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'unlink' } });
                } else {
                    dispatch({ type: 'unlink', payload: rel });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const riskSummary = useCallback(async () => {
        dispatch({ type: 'init' });
        const req = new Empty();
        entitySvc.riskSummary(req,
            { Authorization: 'Bearer ' + await getAccessTokenSilently() },
            (err, rsp) => {
                if (err) {
                    dispatch({ type: 'error', error: err, meta: { method: 'riskSummary' } });
                } else {
                    dispatch({ type: 'riskSummary', payload: rsp.getRisksList() });
                }
            },
        );
    }, [getAccessTokenSilently, dispatch]);

    const clear = useCallback(async () => {
        dispatch({ type: 'clear' });
    }, [dispatch]);

    return { state, add, query, get, update, link, unlink, updateRisk, riskSummary, deleteEntity, clear };
};
