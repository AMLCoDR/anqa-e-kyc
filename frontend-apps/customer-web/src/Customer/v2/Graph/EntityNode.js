import React, { memo } from 'react';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import BusinessIcon from '@material-ui/icons/Business';
// import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import PersonIcon from '@material-ui/icons/Person';
import { Handle } from 'react-flow-renderer';


export default memo((props) => {
    const { id, data } = props;

    const handleRemove = () => {
        data.onRemove(id);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "60px", alignItems: "center" }} >
            {data.onRemove &&
                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <IconButton size="small" onClick={handleRemove} aria-label="delete">
                        <CancelIcon color="disabled" style={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            }
            {data.type === 'ORGANISATION'
                ? <BusinessIcon color={data.value === 'CUSTOMER' ? 'error' : 'primary'} style={{ fontSize: 50 }} />
                : <PersonIcon color="primary" style={{ fontSize: 50 }} />
            }
            <Typography variant="body2" noWrap>
                {data.label}
            </Typography>
            <Handle
                type="target"
                position="top"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <Handle
                type="source"
                position="bottom"
                id="a"
            />
        </Box>
    );
});