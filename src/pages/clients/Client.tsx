import React from 'react';
import TabbedTable from '../../shared/TabbedTable';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import { useParams } from 'react-router-dom';

function Client() {
    let { id } = useParams();
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <Properties type="client" client={id}/>
                    <TabbedTable client={id} />
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={id}/>
                    <Visits client={id}/>
                    <Notes client={id}/>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Client;