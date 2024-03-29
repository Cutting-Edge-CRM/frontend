import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import InvoiceDetails from './InvoiceDetails';
import { getInvoice } from '../../api/invoice.api';
import { useParams } from 'react-router-dom';
import { Alert, Box, CircularProgress } from '@mui/material';
import { listTaxes } from '../../api/tax.api';
import { listPayments } from '../../api/payment.api';
import Timeline from '../../shared/timeline/Timeline';
import { listTimeline } from '../../api/timeline.api';

function Invoice(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({} as any);
    let { id } = useParams();
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);
    const [opened, setOpened] = useState([]);


    useEffect(() => {
        getInvoice(id)
        .then(res => {
            setInvoice(res);
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
                taxes: [{title: "No Tax", tax: 0}]
              }
              res.unshift(none);
            setTaxes(res);
        }, (err) => {
            setError(err.message);
        })
    }, [id, reload])

    useEffect(() => {
        listTimeline(invoice.invoice?.client as string, "invoice", id)
        .then(result => {
            setOpened(result.filter((r: any) => r.resourceAction === 'opened')?.[0]?.created)
        }, err => {
            setError(err.message);
        })
    }, [invoice, id])

    useEffect(() => {
        listPayments(invoice.invoice?.client)
        .then(res => {
            setPayments(res.filter((p: any) => (p.type === 'payment' && p.typeId === invoice.invoice?.id) || (p.type === 'deposit' && p.typeId === invoice.invoice?.quote)));
        }, (err) => {
            setError(err.message);
        })
    }, [invoice, reload])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }
    
    return (
        <>
        <Grid container spacing={2} sx={{width: "100%", margin: 0}}>
          <Grid xs={12} md={8} spacing={2}>
          <Grid container>
              <Grid xs={12}>
              <InvoiceDetails invoice={invoice} setInvoice={setInvoice} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload} settings={props.settings} opened={opened} />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} md={4} spacing={2}>
          <Grid container>
              <Grid xs={12}>
                <Contact client={invoice.invoice?.client} success={props.success}/>
              </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Notes client={invoice.invoice?.client} success={props.success}/>
            </Grid>
            <Grid xs={12} sm={6} md={12}>
                <Timeline client={invoice.invoice?.client} resourceType='invoice' resourceId={invoice.invoice?.id} />
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
      );
}

export default Invoice;