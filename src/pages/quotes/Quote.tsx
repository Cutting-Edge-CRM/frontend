import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import QuoteDetails from './QuoteDetails';
import { useParams } from 'react-router-dom';
import Property from '../../shared/property/Property';
import { getQuote } from '../../api/quote.api';
import { Alert, Box, CircularProgress } from '@mui/material';
import { listTaxes } from '../../api/tax.api';
import { listPayments } from '../../api/payment.api';
import Timeline from '../../shared/timeline/Timeline';

function Quote(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState({} as any);
    let { id } = useParams();
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        getQuote(id)
        .then(res => {
            setQuote(res);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id, reload])

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

    useEffect(() => {
        listPayments(quote.quote?.client)
        .then(res => {
            setPayments(res.filter((p: any) => p.type === 'deposit' && p.typeId === quote.quote?.id));
        }, (err) => {
            setError(err.message);
        })
    }, [quote])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }

    return (
        <>
        <Grid container spacing={2}>
          <Grid xs={12} md={8} spacing={2}>
          <Grid container>
              <Grid xs={12}>
                <QuoteDetails quote={quote} setQuote={setQuote} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload}  settings={props.settings}/>
              </Grid>
              <Grid xs={12}>
                <Property property={quote.quote?.property} success={props.success}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} md={4} spacing={2}>
          <Grid container>
              <Grid xs={12}>
                <Contact client={quote.quote?.client} success={props.success}/>
              </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Notes client={quote.quote?.client} success={props.success}/>
            </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Timeline client={quote.quote?.client} resourceType='quote' resourceId={quote.quote?.id} />
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
      );
}

export default Quote;