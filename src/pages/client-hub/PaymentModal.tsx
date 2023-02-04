import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createDeposit, createPayment } from '../../api/stripePayments.api';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

export default function PaymentModal(props: any) {
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [intent, setIntent] = useState({} as any);
    const [stripePromise, setStripePromise] = useState(null as any);

    const handleCancel = () => {
        props.onClose();
      };

    useEffect(() => {
        if (!props.open || intent.client_secret) return;
        setLoading(true);
        if (props.type === 'deposit') {
            createDeposit(props.quote.quote.client, props.quote.quote.id)
            .then(intent => {
                loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww").then(loadStripe => {
                    console.log(intent);
                    console.log(loadStripe);
                    setStripePromise(loadStripe);
                    setIntent(intent);
                    setLoading(false);
                  }, err => {
                    setError(err.message);
                    setLoading(false);
                  })
                
            }, err => {
                setError(err.message);
                setLoading(false);
            })
        } else {
            createPayment(props.invoice.invoice.client, props.invoice.invoice.id)
            .then(intent => {
                loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww").then(loadStripe => {
                    console.log(intent);
                    console.log(loadStripe);
                    setStripePromise(loadStripe);
                    setIntent(intent);
                    setLoading(false);
                  }, err => {
                    setError(err.message);
                    setLoading(false);
                  })
                
            }, err => {
                setError(err.message);
                setLoading(false);
            })
        }

    }, [props.quote, props.invoice, props.open, props.type, intent])

    useEffect(() => {
        switch (props.type) {
            case 'deposit':
                setTitle(`Pay Deposit`);
                break;
            case 'payment':
                setTitle('Pay Invoice');
                break;
            default:
                break;
        }
    }, [props.type, props.price])  
    
    return (
    <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            {loading && <Box textAlign='center'><CircularProgress /></Box>}
            {!loading && intent.client_secret && stripePromise &&
                <Elements stripe={stripePromise} options={{clientSecret: intent.client_secret}}>
                    <CheckoutForm handleCancel={handleCancel}/>
                </Elements>
            }
        </DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }