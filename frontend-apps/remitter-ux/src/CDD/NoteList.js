import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography'
import SwapVertIcon from '@material-ui/icons/SwapVert';

import Note from './Note';
import NoteEditor from './NoteEditor';

const NoteList = props => {
    const { notes, onAddNote, onDeleteNote, onUpdateNote } = props;
    const [reverse, setReverse] = useState(true);

    const handleAddNote = text => {
        onAddNote(text);
    };

    const handleUpdateNote = (index, text) => {
        onUpdateNote(index, text);
    };

    const handleDeleteNote = index => {
        onDeleteNote(index);
    };

    return (<>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
            <Stack direction="row" justifyContent="left" alignItems="baseline">
                <Typography variant="h5" mt={2}>Notes</Typography>
                <IconButton onClick={() => setReverse(!reverse)} size="small">
                    <SwapVertIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Stack>
        <NoteEditor onSave={handleAddNote} />
        <Stack direction={reverse ? 'column-reverse' : 'column'}> {
            notes.map((n, i) => (<Note key={i} note={n} onUpdate={handleUpdateNote} onDelete={handleDeleteNote} />))
        }
        </Stack>
    </>);
};

export default NoteList;