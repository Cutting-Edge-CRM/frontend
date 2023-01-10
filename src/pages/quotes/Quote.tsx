import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import QuoteDetails from '../../shared/QuoteDetails';
import { useParams } from 'react-router-dom';
import Property from '../../shared/property/Property';
import { getQuote } from '../../api/quote.api';
import { Typography } from '@mui/material';

function Quote() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState({} as any);
    let { id } = useParams();

    useEffect(() => {
        getQuote(id)
        .then(res => {
            setQuote(res);
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
                    <QuoteDetails quote={quote} setQuote={setQuote}/>
                    <Property property={quote.quote?.property}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={quote.quote?.client}/>
                    <Notes client={quote.quote?.client} />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Quote;