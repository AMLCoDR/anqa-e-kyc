import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FilterList from 'components/FilterList';
import SearchBar from 'components/SearchBar';
import mixpanel from 'mixpanel-browser';
import { useNavigate, useParams } from "react-router-dom";

import { customerRisks } from '../../../types/risklevels';
import { useEntity } from '../context/index';
import { ListBody } from './ListBody';

export const EntityList = () => {
    const navigate = useNavigate();
    const { risk } = useParams();
    const [filter, setFilter] = useState({
        risk: risk,
        isCustomer: true,
    });
    const { clear } = useEntity();

    useEffect(() => {
        mixpanel.track('View customers page');
    }, []);

    const handleRisk = (r) => {
        setFilter(prev => {
            return { ...prev, risk: r }
        })
    };

    const handleCustOnly = event => {
        setFilter(prev => ({ ...prev, isCustomer: event.target.checked }));
    };

    const handleSearch = (txt) => {
        setFilter(prev => {
            return { ...prev, searchText: txt };
        });
    };

    const handleAdd = () => {
        clear();
        navigate('/customers/add');
    };

    return (
        <div data-test="customers">
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}  >
                <Button onClick={handleAdd} variant='contained' data-test="add-customer">
                    Add
                </Button>
            </Box>
            <Box sx={{ display: "flex", mb: 2 }}>
                <FilterList variant="default" name="CustomerRisk" label="Risk" options={customerRisks} value={filter.risk} onChange={handleRisk} />
                <Box sx={{
                    pt: 2.5, pl: 2,
                    width: { xl: '50%', lg: '50%', md: '75%', sm: '55%', xs: '50%' }
                }}>
                    <SearchBar value={filter.searchText} onChange={handleSearch} />
                </Box>
                <Box sx={{
                    pt: 2.5,
                    pl: 2
                }}>
                    <FormControlLabel
                        control={<Switch checked={filter.isCustomer} onChange={handleCustOnly} />}
                        label={<Typography variant="body2">Customers</Typography>}
                        data-test="customer-toggle"
                    />
                </Box>
            </Box>
            <ListBody filter={filter} />
        </div>
    );
};

EntityList.propTypes = {};

export default EntityList;
