import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import InvoiceDetails from '../../shared/InvoiceDetails';
import { getInvoice } from '../../api/invoice.api';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

function Invoice() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({} as any);
    let { id } = useParams();

    useEffect(() => {
        getInvoice(id)
        .then(res => {
            setInvoice(res);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id])


    if (error) {
        return (<Typography>{error}</Typography>);
        }
    if (!isLoaded) {
        return (<Typography>Loading...</Typography>);
        }
    
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <InvoiceDetails invoice={invoice} setInvoice={setInvoice}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={invoice?.invoice.client}/>
                    <Visits client={invoice?.invoice.client}/>
                    <Notes client={invoice?.invoice.client} />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Invoice;