import React, { useState } from 'react';
import TabbedTable from '../../shared/TabbedTable';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ConfirmDelete from '../../shared/ConfirmDelete';

function Client() {
    let { id } = useParams();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = (value: string) => {
        setDeleteOpen(false);
        navigate("/clients")
    };

    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <Properties type="client" client={id}/>
                    <TabbedTable client={id} />
                    <Button onClick={handleDeleteOpen}>Delete Client</Button>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={id}/>
                    <Visits client={id}/>
                    <Notes client={id}/>
                </Stack>
            </Grid>
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'clients'}
            deleteId={id}
            />
        </Grid>
    )
}

export default Client;