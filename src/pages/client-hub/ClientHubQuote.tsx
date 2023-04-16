import React, { useEffect, useState } from 'react';
import ClientHubQuoteDetails from './ClientHubQuoteDetails';
import { useParams } from 'react-router-dom';
import { getQuote } from '../../api/quote.api';
import { Alert, Box, CircularProgress } from '@mui/material';
import { listTaxes } from '../../api/tax.api';
import { listPayments } from '../../api/payment.api';
import PaymentStatus from './PaymentStatus';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { retrieveAccount } from '../../api/stripePayments.api';
import { getClient } from '../../api/client.api';
import { listTimeline } from '../../api/timeline.api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

function ClientHubQuote(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState({} as any);
    const [client, setClient] = useState({} as any);
    const [opened, setOpened] = useState([]);
    const [sent, setSent] = useState([]);
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);
    const [paymentsEnabled, setPaymentsEnabled] = useState(false);
    let { quoteId } = useParams();
    let { clientId } = useParams();

    useEffect(() => {
        setIsLoaded(false);
        getQuote(quoteId)
        .then(result => {
            setQuote(result);
            setIsLoaded(true);
        }, err => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [quoteId])

    useEffect(() => {
        getClient(clientId as string)
        .then(result => {
            setClient(result);
        }, err => {
            setError(err.message);
        })
    }, [clientId])

    useEffect(() => {
        listTimeline(clientId as string, "quote", quoteId)
        .then(result => {
            setOpened(result.filter((r: any) => r.resourceAction === 'opened')?.[0]?.created)
            setSent(result.filter((r: any) => r.resourceAction === 'sent')?.[0]?.created)
        }, err => {
            setError(err.message);
        })
    }, [clientId, quoteId])

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
    }, [])

    useEffect(() => {
        listPayments(clientId)
        .then(res => {
            setPayments(res.filter((p: any) => p.type === 'deposit' && p.typeId === quote.quote?.id));
        }, (err) => {
            setError(err.message);
        })
    }, [quote, clientId])

    useEffect(() => {
        retrieveAccount()
        .then(res => {
            if (res.stripeRes?.charges_enabled) {
                setPaymentsEnabled(true);
            }
        }, err => {
        })
    }, [])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }

    return (
        <Elements stripe={stripePromise}>
        <PaymentStatus/>
        <ClientHubQuoteDetails quote={quote} setQuote={setQuote} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload} paymentsEnabled={paymentsEnabled} client={client} opened={opened} sent={sent} settings={props.settings} />
        </Elements>
    )
}

export default ClientHubQuote;