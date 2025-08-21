import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import * as PropTypes from 'prop-types';

import { IdType } from '../../proto/idcheck/v2/id_check_pb.js';
import Renderer from './Renderer';

const EddCard = ({ entity }) => {

    return (
        <Card elevation={0} data-test="enhanced-due-diligence">
            <CardHeader
                data-ele='enhanced-due-diligence'
                title="Enhanced Due Diligence"
                subheader="An Enhanced Due Diligence check is recommended for high risk entities"
            />
            <CardContent>
                <Renderer checkType={`${IdType.ID_TYPE_WATCHLIST}`} entity={entity} />
            </CardContent>
        </Card>
    );
};

EddCard.propTypes = {
    entity: PropTypes.object,
};

export default EddCard;