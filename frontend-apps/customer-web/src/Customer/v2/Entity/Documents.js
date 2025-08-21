import React, { useEffect, useState } from 'react';

import Autocomplete from '@material-ui/core/Autocomplete';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDocument } from 'components/Document';
import { FileUpload } from 'components/Form';
import { ListOutline } from 'components/Outline';
import { TablePager } from 'components/TablePager';
import cloneDeep from 'lodash.clonedeep';
import * as PropTypes from 'prop-types';
// import config from 'react-global-configuration';

import config from '../../../config';


const pageSize = 10;

export const Documents = ({ scope, filter }) => {
    const [page, setPage] = useState({ offset: 0, limit: pageSize });
    const [document, setDocument] = useState();
    const [docType, setDocType] = useState("");
    const { state, add, query, get, update, remove } = useDocument(scope);

    useEffect(() => {
        query(filter, page);
    }, [query, filter, page]);

    const handleUpload = file => {
        if (file && file.size > config.maxUploadSize) {
            return;
        }
        add(file, docType);
    };

    var fileExists;
    if (state.documents.length === 0) {
        fileExists = 'Upload file'
    } else { fileExists = 'Upload another file' }



    const handleDownload = (docId) => {
        const callback = (err, rsp) => {
            window.location.assign(rsp.getUrl());
        }
        get(docId, callback)
    };

    const handleEdit = (docId) => {
        const callback = (err, rsp) => {
            setDocument(rsp);
        }
        get(docId, callback)
    };
    const handleCancel = (e) => {
        e.preventDefault();
        setDocument(null);
    };
    const handleNameChange = (e) => {
        const d = cloneDeep(document);
        d.setName(e.target.value);
        setDocument(d);
    };
    const handleTitleChange = (e) => {
        const d = cloneDeep(document);
        d.setTitle(e.target.value);
        setDocument(d);
    };
    const handleTagsChange = (value) => {
        const d = cloneDeep(document);
        d.setTagsList(value);
        setDocument(d);
    };
    const handleSave = () => {
        update(document);
        setDocument(null);
    };

    const handleDelete = (docId) => {
        remove(docId)
    };

    const handlePage = () => {
        setPage(prev => ({ ...prev, limit: prev.limit + pageSize }))
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ flexGrow: 1, pr: 1 }}>
                    <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                        <InputLabel id="doc-type-label">Document Type</InputLabel>
                        <Select
                            labelId="doc-type-label"
                            label="Document Type"
                            value={docType}
                            onChange={e => setDocType(e.target.value)}
                        >
                            <MenuItem value=""><em>unspecified</em></MenuItem>
                            <MenuItem value="Address">Address</MenuItem>
                            <MenuItem value="Constitution">Constitution</MenuItem>
                            <MenuItem value="Identity Record">Identity Record</MenuItem>
                            <MenuItem value="Registration">Registration</MenuItem>
                            <MenuItem value="Source of Funds">Source of Funds</MenuItem>
                            <MenuItem value="Source of Wealth">Source of Wealth</MenuItem>
                            <MenuItem value="Trust Deed">Trust Deed</MenuItem>

                        </Select>
                    </FormControl>
                </Box>
                <FileUpload onChange={handleUpload} title={fileExists} />
            </Box>

            <TableContainer elevation={0} component={Paper} data-test="customer-list">
                <Table stickyHeader size="small" aria-label="document list">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">Name</TableCell>
                            <TableCell component="th">Type</TableCell>
                            <TableCell component="th" />
                            <TableCell component="th" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.documents.map((doc, index) =>
                            <TableRow key={index} hover data-test="customer-item">
                                <TableCell onClick={() => handleEdit(doc.getId())} sx={{ cursor: 'pointer' }}>
                                    {doc.getName()}
                                </TableCell>
                                <TableCell onClick={() => handleEdit(doc.getId())} sx={{ cursor: 'pointer' }}>
                                    {doc.getTitle()}
                                </TableCell>
                                <TableCell>
                                    {doc.getTagsList()}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Download">
                                        <IconButton size="small" onClick={() => handleDownload(doc.getId())}>
                                            <CloudDownloadIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton size="small" onClick={() => handleDelete(doc.getId())}>
                                            <HighlightOffIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )}
                        {state.documents.length === 0 &&
                            <TableRow style={{ minHeight: 53 * 2 }}>
                                <TableCell colSpan="5" align="center">
                                    {state.pending
                                        ? <ListOutline visible={state.pending} />
                                        : null
                                    }
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    <TablePager count={state.documents.length} total={state.matches}
                        colSpan={5} onPage={handlePage}
                    />
                </Table>
            </TableContainer>

            {document &&
                <Dialog open={Boolean(document)} onClose={handleCancel} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        Update details for {document.getName()}
                        <IconButton aria-label="close" onClick={handleCancel}
                            size="small" edge="end" sx={{
                                position: 'absolute',
                                right: 1,
                                top: 1,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{
                        minWidth: {
                            md: 60,
                            lg: 60,
                            xl: 60
                        }
                    }}>
                        <TextField label='Name' onChange={handleNameChange} value={document.getName()}
                            variant='outlined' margin='dense' fullWidth />
                        <TextField label='Title' onChange={handleTitleChange} value={document.getTitle()}
                            variant='outlined' margin='dense' fullWidth />
                        <TagList onChange={handleTagsChange} value={document.getTagsList()} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    );
};

Documents.propTypes = {
    filter: PropTypes.object.isRequired,
};

Documents.defaultProps = {
    filter: {}
}

export default Documents;

// const filterOpts = createFilterOptions();

const TagList = ({ onChange, value }) => {

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            renderInput={params =>
                <TextField {...params} variant="outlined" label="Tags" />
            }
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip key={index} size="small" variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
            options={[]} //{value}
            getOptionLabel={(option) => option.title}
            // filterOptions={(options, params) => {
            //     const filtered = filterOpts(options, params);
            //     if (params.inputValue !== '') {
            //         filtered.push(`${params.inputValue}`);
            //     }
            //     return filtered;
            // }}
            renderOption={(props, option, { selected }) => (
                <>
                    <Typography {...props} variant="body2">
                        {option.title}
                    </Typography>
                    {selected && <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />}
                </>
            )}

            freeSolo
            multiple
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
        />
    );
}