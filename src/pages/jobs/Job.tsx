import React from 'react';
import Properties from '../../components/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Visits from '../../components/Visits';
import Notes from '../../components/Notes';
import JobDetails from '../../components/JobDetails';

function Job() {
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <JobDetails/>
                    <Properties />
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

export default Job;