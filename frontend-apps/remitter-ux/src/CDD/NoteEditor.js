import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const NoteEditor = props => {
    const { note, onCancel, onSave } = props;
    const [noteText, setNoteText] = useState('');
    const [rows, setRows] = useState(1);
    const MAXROWS = 3;

    useEffect(() => {
        if (note) {
            setNoteText(note.text);
            setRows(MAXROWS);
        }
    }, [note]);

    const handleSave = () => {
        onSave(noteText);
        setNoteText('');
        setRows(1);
    };

    const handleTextChanged = event => {
        event.preventDefault();
        setNoteText(event.target.value);
    };

    const handleCancel = () => {
        onCancel();
        setNoteText('');
        setRows(1);
    };

    const handleGetFocus = () => {
        if (rows === 1) {
            setRows(MAXROWS);
        }
    };

    return (
        <Box
            component="form"
            display="flex"
            flexDirection="column"
            my={2}
        >
            <TextField
                inputProps={{ maxLength: 1000 }}
                label={noteText ? '' : "Add a note..."}
                minRows={rows}
                multiline={true}
                onChange={handleTextChanged}
                onFocus={handleGetFocus}
                value={noteText}
                variant="outlined"
            />
            <Box justifyContent="flex-end" my={2} display={rows === 1 ? 'none' : 'flex'}>
                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleSave}>Save</Button>
            </Box>
        </Box>
    );
};

export default NoteEditor;