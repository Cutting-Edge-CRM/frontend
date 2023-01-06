import React from 'react';
import Properties from '../../components/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Notes from '../../components/Notes';
import QuoteDetails from '../../components/QuoteDetails';

function Quote() {
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <QuoteDetails/>
                    <Properties />
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact/>
                    <Notes />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Quote;