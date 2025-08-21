import React, { Fragment, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';

import { useData } from '../Datasource';
import NoteList from './NoteList';
import RiskSelector from './RiskSelector';

const CDDPerson = props => {
    const navigate = useNavigate();
    const { custId, id } = useParams();
    const [state, actions] = useData();
    const [person, setPerson] = useState({});
    const [risk, setRisk] = useState(0);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        setPerson(state.people[id]);
        setRisk(state.people[id].risk);
        setNotes(state.cddNotes.reduce((acc, n, i) => {
            if (n.personId === parseInt(id)) {
                acc.push({
                    noteId: i,
                    ...n,
                });
            }
            return acc;
        }, []));
    }, [id, state]);

    const handleChangeRisk = r => {
        actions.updatePersonRisk(id, r);
        setRisk(r);
    };

    const handleAddNote = text => {
        const newNote = {
            personId: parseInt(id),
            createdAt: 'just now',
            createdBy: 'Andrew Goldie',
            text: text,
        }
        actions.addCDDNote(newNote);
    };

    const handleUpdateNote = (index, text) => {
        const newNote = {
            ...state.cddNotes[index],
            text,
        };
        actions.updateCDDNote(index, newNote);
    };

    const handleDeleteNote = index => {
        actions.deleteCDDNote(index);
    };

    return (<>
        <Typography variant="h3" component="h2">CDD Report</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
                variant="h4"
                component="h3"
                sx={{ display: 'inline' }}
            >
                {`${person.givenNames} ${person.familyName}`}
            </Typography>
            {(person.status === 'verified') && <CheckCircleIcon color="success" />}
            <RiskSelector risk={risk} onChange={handleChangeRisk} />
        </Stack>
        {person.watchlist
            ? <Link target="_blank" rel="noopener" href={person.watchlist}>View watchlist report</Link>
            : <Typography>No watchlist report</Typography>
        }
        <NoteList notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onUpdateNote={handleUpdateNote} />
        <Stack spacing={1} direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => navigate(`/cdd/${custId}`)} variant="contained">Close</Button>
        </Stack>
    </>);
};

export default CDDPerson;