import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { useResource } from 'components/Resource';
import * as PropTypes from 'prop-types';

import { useVerification } from './context';
import Renderer from './Renderer';

const checkTypes = { 0: 'Passport', 1: 'Drivers Licence', 2: 'Address', 3: 'National ID' };
const checkTypesEntries = Object.entries(checkTypes);

const getIdCheckMap = (idChecks) => {
    return checkTypesEntries.reduce((map, [idType]) => ({
        ...map,
        [idType]: (idChecks[idType] !== undefined)
    }), {});
};

export const IdCard = ({ entity }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { state: { idChecks }, fetch: fetchChecks, add: addCheck, clear: clearChecks } = useVerification();
    const { state: { labels } } = useResource();
    const [checkMap, setCheckMap] = useState(getIdCheckMap(idChecks));

    useEffect(() => {
        fetchChecks(entity.getId());
        return () => {
            setCheckMap({});
            clearChecks();
        }
    }, [entity, fetchChecks, clearChecks]);

    // set diplay state for each check type; rendered or dropdown menu
    useEffect(() => {
        setCheckMap(getIdCheckMap(idChecks));
    }, [idChecks]);

    // add a new check to the list of visible checks
    const handleAddCheck = (idType) => {
        addCheck(idType);
        setAnchorEl(null);
    };

    return (
        <Card elevation={0} data-test="id-check">
            <CardHeader
                title="Verification"
                subheader="We recommend verifying the ID used when on-boarding this entity"
                data-ele="verification"
            />
            {/* render completed checks */}
            <CardContent>
                {Object.entries(checkMap).map(([key, visible]) => visible &&
                    <Renderer key={key} checkType={key} entity={entity} />
                )}
            </CardContent>
            {/* build menu of remaining available checks */}
            <Button onClick={e => setAnchorEl(e.currentTarget)} data-test="add-id-check">
                <AddIcon fontSize="small" /> {labels.buttons.verification}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl()}
            >
                {Object.entries(checkMap).map(([idType, visible], index) => !visible &&
                    <MenuItem key={index} onClick={() => handleAddCheck(idType)} data-test="id-check-type">
                        {checkTypes[idType]}
                    </MenuItem>
                )}
            </Menu>
        </Card>
    );
};

IdCard.propTypes = {
    entity: PropTypes.object,
};

export default IdCard;