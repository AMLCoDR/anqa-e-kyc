// import React from 'react';

// import { useFlags } from 'launchdarkly-react-client-sdk';

import { useEntity as useEntityV2, EntityProvider as EntityProviderV2 } from './useEntity';

export const EntityProvider = (props) => {
    return EntityProviderV2(props);
    // const { someFlag } = useFlags();
    // return someFlag ? EntityProviderV2(props) : EntityProviderV1(props);
}

export const useEntity = () => {
    return useEntityV2();
    // const { someFlag } = useFlags();
    // return someFlag ? v2() : v1();
}

export { useCustomer, CustomerProvider } from './useCustomer';