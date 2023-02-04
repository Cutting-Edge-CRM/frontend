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

const stripePromise = loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww");

function ClientHubQuote(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState({} as any);
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);
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
    }, [])

    useEffect(() => {
        listPayments(clientId)
        .then(res => {
            setPayments(res.filter((p: any) => p.type === 'deposit' && p.typeId === quote.quote?.id));
        }, (err) => {
            setError(err.message);
        })
    }, [quote, clientId])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }

    return (
        <Elements stripe={stripePromise}>
        <PaymentStatus/>
        <ClientHubQuoteDetails quote={quote} setQuote={setQuote} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload}/>
        </Elements>
    )
}

export default ClientHubQuote;