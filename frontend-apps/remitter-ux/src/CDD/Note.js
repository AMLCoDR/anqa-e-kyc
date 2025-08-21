import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReactMarkdown from 'react-markdown';

import NoteEditor from './NoteEditor';

const Note = props => {
    const { note, onDelete, onUpdate } = props;
    const [editMode, setEditMode] = useState(false);

    const handleUpdate = text => {
        onUpdate(note.noteId, text);
        setEditMode(false);
    };

    const handleDelete = () => {
        onDelete(note.noteId);
        setEditMode(false);
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                <Box>
                    <Typography component="span" variant="body2" color="textSecondary">
                        {note.createdBy}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <Typography component="span" variant="body2" color="textSecondary">
                        {note.createdAt}
                    </Typography>
                    <IconButton size="small" onClick={() => setEditMode(true)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={handleDelete}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            </Stack>
            {editMode
                ? <NoteEditor note={note} onCancel={() => setEditMode(false)} onSave={handleUpdate} />
                : <Box>
                    <Typography component="span" variant="body1"
                        sx={{ '& p:first-of-type': { mt: 0 }, '& p:last-of-type': { mb: 0 } }}
                    >
                        <ReactMarkdown>{note.text}</ReactMarkdown>
                    </Typography>
                </Box>
            }
        </Box>);
};

export default Note;