import React, { createContext, useContext, useState } from 'react';

// Use this provider and context for global, app-level state management.
// In general, child MFEs should manage their own stage for business data.

const ServiceContext = createContext(undefined);

const useServiceState = (config) => {
    const [service, setService] = useState(config);
    return { service, setService };
}

export const ServiceProvider = props => {
    const { service, setService } = useServiceState(props.config);

    return (
        <ServiceContext.Provider value={{ service, setService }}>
            {props.children}
        </ServiceContext.Provider>
    );
}

export const useService = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error(
            "ServiceContext value is undefined. Make sure you use the ServiceProvider before using the context."
        );
    }
    return context;
}
