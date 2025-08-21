import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

import { customers } from './data';

// Consider using a deep clone library to avoid repeating code.
// Depends on real application data structure.
const copyState = state => ({
    ...state,
    customer: { ...state.customer },
    people: [
        ...state.people
    ],
    cddNotes: [
        ...state.cddNotes
    ]
});


const reducer = (state, action) => {
    // const newState = cloneDeep(state);

    switch (action.type) {
        case 'init':
            return state;
        case 'addCustomer':
            // localStorage.setItem('customer', JSON.stringify(action.payload));
            // state.customer = action.payload;
            return state;
        case 'addPerson':
            // state.people.push(action.payload);
            // localStorage.setItem('people', JSON.stringify(state.people));
            return state;
        case 'clear':
            localStorage.clear();
            state = initialState;
            return state;
        case 'updateCustomerRisk': {
            const { risk } = action.payload;
            const newState = copyState(state);
            newState.customer.risk = risk;
            return newState;
        }
        case 'updatePersonOwnership': {
            const { index, ownership } = action.payload;
            const newState = copyState(state);
            newState.people[index].ownership = ownership;
            return newState;
        }
        case 'updatePersonRisk': {
            const { index, risk } = action.payload;
            const newState = copyState(state);
            newState.people[index].risk = risk;
            return newState;
        }
        case 'addCDDNote': {
            const { note } = action.payload;
            const newState = copyState(state);
            newState.cddNotes.push(note);
            return newState;
        }
        case 'updateCDDNote': {
            const { index, note } = action.payload;
            const newState = copyState(state);
            newState.cddNotes[index] = note;
            return newState;
        }
        case 'deleteCDDNote': {
            const { index } = action.payload;
            const newState = copyState(state);
            newState.cddNotes.splice(index, 1);
            return newState;
        }
        case 'get':
        case 'update':
        case 'delete':
        case 'error':
        default:
            throw new Error('Unknown action type in document reducer');
    }
};

const initialState = {
    tenant: 'Sticky Fingers Accounting',
    customers: customers,
    customer: {
        name: 'Dodgy',
        type: 'Company',
        purpose: 'Tax avoidance',
        email: 'john.doe@acustomer.com',
        risk: 0,
    },
    people: [
        {
            givenNames: 'John Alexander',
            familyName: 'Doe',
            birthDate: '02-Jan-2006',
            email: 'john.doe@acustomer.com',
            relationship: 'Shareholder',
            ownership: '100%',
            status: '',
            risk: 3,
            watchlist: 'https://idu.datazoo.com/api/v2/watchlist/PDF/519303',
        },
        {
            givenNames: 'Jess Megan',
            familyName: 'Doe',
            birthDate: '02-Jan-2006',
            email: 'jess.megan@acustomer.com',
            relationship: 'Director',
            status: 'sent',
            risk: 2,
        },
        {
            givenNames: 'Robert Bruce',
            familyName: 'Lee',
            birthDate: '02-Jan-2006',
            email: 'rob.bruce@acustomer.com',
            relationship: 'Authorised individual',
            status: 'verified',
            risk: 1,
        }
    ],
    id: {
        method: 'Passport',
        number: 'LM12345',
        expiryDate: '02-Jan-2026'
    },
    cddNotes: [
        {
            personId: 0,
            createdAt: '17-Jul-2021 10:32',
            createdBy: 'Yixuan Hou',
            text: 'John is listed as a PEP and there are a couple of adverse media articles. Need to research those articles to determine if they present a real risk or are politically based.',
        },
        {
            personId: 0,
            createdAt: '18-Jul-2021 11:16',
            createdBy: 'Andrew Weston',
            text: '**Important**: There is some cause for concern. Needs manager review.',
        },
        {
            personId: 0,
            createdAt: '19-Jul-202 08:57',
            createdBy: 'Daniel Rogers',
            text: 'May present a risk due to suspected but unproven fraud mentioned in historic media article.',
        },
    ],
    error: null,
};

const DataContext = createContext(initialState);

export const DataProvider = (props) => {
    const customer = localStorage.getItem('customer')
    initialState.customer = customer ? JSON.parse(customer) : initialState.customer;

    const people = localStorage.getItem('people')
    initialState.people = people ? JSON.parse(people) : initialState.people;

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {props.children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    let context = useContext(DataContext);
    if (context.state === undefined) {
        throw new Error("useData should only be used within the scope of DataProvider")
    }
    const { state, dispatch } = context;

    const addCustomer = useCallback((customer) => {
        dispatch({ type: 'addCustomer', payload: customer });
    }, [dispatch]);

    const addPerson = useCallback((person) => {
        dispatch({ type: 'addPerson', payload: person });
    }, [dispatch]);

    const clear = useCallback(() => {
        console.log("here")
        dispatch({ type: 'clear' });
    }, [dispatch]);

    const updateCustomerRisk = useCallback((custId, risk) => {
        dispatch({ type: 'updateCustomerRisk', payload: { custId, risk } });
    }, [dispatch]);

    const updatePersonOwnership = useCallback((index, ownership) => {
        dispatch({ type: 'updatePersonOwnership', payload: { index, ownership } });
    }, [dispatch]);

    const updatePersonRisk = useCallback((index, risk) => {
        dispatch({ type: 'updatePersonRisk', payload: { index, risk } });
    }, [dispatch]);

    const addCDDNote = useCallback(note => {
        dispatch({ type: 'addCDDNote', payload: { note } });
    }, [dispatch]);

    const updateCDDNote = useCallback((index, note) => {
        dispatch({ type: 'updateCDDNote', payload: { index, note } });
    }, [dispatch]);

    const deleteCDDNote = useCallback(index => {
        dispatch({ type: 'deleteCDDNote', payload: { index } });
    }, [dispatch]);

    const actions = useMemo(() => {
        return {
            addCustomer,
            addPerson,
            clear,
            updateCustomerRisk,
            updatePersonOwnership,
            updatePersonRisk,
            addCDDNote,
            updateCDDNote,
            deleteCDDNote,
        };
    }, [
        addCustomer,
        addPerson,
        clear,
        updateCustomerRisk,
        updatePersonOwnership,
        updatePersonRisk,
        addCDDNote,
        updateCDDNote,
        deleteCDDNote,
    ]);

    return [state, actions]
};
