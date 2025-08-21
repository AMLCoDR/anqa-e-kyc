import React, { useEffect, useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { useTracker } from 'components/Instana';

import config from '../config';
import { ReportingEntityServiceClient } from '../proto/reportingentity/v2/reporting_entity_grpc_web_pb';
import { GetRequest } from '../proto/reportingentity/v2/reporting_entity_pb';

const orgSvc = new ReportingEntityServiceClient(config.apiUrl);

const Name = props => {
    const [fetching, setFetching] = useState(false);
    const [name, setName] = useState(null);
    const { getAccessTokenSilently } = useAuth0();
    const { error: logError } = useTracker();

    useEffect(() => {
        if (!fetching && (name === null)) {
            setFetching(true);
            const fetch = async () => {
                const req = new GetRequest();
                orgSvc.get(
                    req,
                    { Authorization: 'Bearer ' + await getAccessTokenSilently() },
                    (err, res) => {
                        if (!err) {
                            res.getReportingEntity().getName() ? setName(res.getReportingEntity().getName()) : setName('Your organisation');
                            setFetching(false);
                        } else {
                            logError(err.message, { method: 'ReportingEntity.Name fetch' })
                            console.error(err);
                            setName('Your organisation');
                        }
                    }
                )
            };
            fetch();
        }
    }, [fetching, getAccessTokenSilently, name, logError]);

    return (<span>
        {name}
    </span>);
};

export default Name;
