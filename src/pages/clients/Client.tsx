import React from 'react';
import TabbedTable from '../../components/TabbedTable';
import Properties from '../../components/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Visits from '../../components/Visits';
import Notes from '../../components/Notes';
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
                    <Notes />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Client;