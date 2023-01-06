import React from 'react';
import TabbedTable from '../../components/TabbedTable';
import Properties from '../../components/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Visits from '../../components/Visits';
import Notes from '../../components/Notes';

function Client() {
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <Properties type="client"/>
                    <TabbedTable client={1} />
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact/>
                    <Visits/>
                    <Notes />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Client;