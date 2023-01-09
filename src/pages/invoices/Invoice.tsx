import React from 'react';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import InvoiceDetails from '../../shared/InvoiceDetails';

function Invoice() {
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <InvoiceDetails/>
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

export default Invoice;