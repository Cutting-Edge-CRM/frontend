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
import { listTaxes } from '../../api/tax.api';

function Quote() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState({} as any);
    let { id } = useParams();
    const [taxes, setTaxes] = useState([] as any);

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

    useEffect(() => {
        listTaxes()
        .then(res => {
            let none = {
                id: null,
                title: "No Tax",
                tax: 0
              }
              res.unshift(none);
            setTaxes(res);
        }, (err) => {
            setError(err.message);
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
                    <QuoteDetails quote={quote} setQuote={setQuote} taxes={taxes}/>
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