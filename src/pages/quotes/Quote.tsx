import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';
import Notes from '../../components/Notes';
import QuoteDetails from '../../components/QuoteDetails';
import { useParams } from 'react-router-dom';
import Property from '../../components/Property';
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
            setQuote(res.quote);
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
                    <QuoteDetails/>
                    <Property property={quote?.property}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={quote?.client}/>
                    <Notes />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Quote;