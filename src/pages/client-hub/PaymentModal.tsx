import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, InputLabel, TextField, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { AttachMoney } from '@mui/icons-material';
import { createDeposit, createPayment } from './api/clientPublic.api';
import { theme } from '../../theme/theme';

export default function PaymentModal(props: any) {
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [intent, setIntent] = useState({} as any);
    const [stripePromise, setStripePromise] = useState(null as any);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [step, setStep] = useState(0);

    const handleCancel = () => {
        props.onClose();
      };

    const handleChangeAmount = (event: any) => {
        setPaymentAmount(event.target.value);
    }

    const handleChangeStep = () => {
        if (step === 0) {
            getIntent();
            setStep(1);
        } else {
            setStep(0);
        }
    }

    const getIntent = () => {
        setLoading(true);
        if (props.type === 'deposit') {
            createDeposit(props.quote.quote.client, props.quote.quote.id, (+(+paymentAmount).toFixed(2)))
            .then(intent => {
                loadStripe(process.env.REACT_APP_STRIPE_KEY as string).then(loadStripe => {
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
            createPayment(props.invoice.invoice.client, props.invoice.invoice.id, (+(+paymentAmount).toFixed(2)))
            .then(intent => {
                loadStripe(process.env.REACT_APP_STRIPE_KEY as string).then(loadStripe => {
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
    }

    useEffect(() => {
        setPaymentAmount(props.amount);
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
    }, [props.type, props.price, props.amount])  

    
    return (
    <Dialog onClose={handleCancel} open={props.open} fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            {step === 0 &&
            <>
            <InputLabel id="amount-label" sx={{ color: 'primary.main' }}>
                Amount
            </InputLabel>
            <TextField
                id="amount"
                value={
                paymentAmount ? paymentAmount : ''
                }
                type='number'
                onChange={handleChangeAmount}
                error={paymentAmount.toString() === '0'}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AttachMoney color="primary" />
                    </InputAdornment>
                ),
                }}
            />
            <DialogActions sx={{mt: 3}}>
                <Button variant='outlined' onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' onClick={handleChangeStep} disabled={!paymentAmount || paymentAmount.toString() === '0'}>Continue</Button>
            </DialogActions>
            </>
            }

            {loading && <Box textAlign='center'><CircularProgress /></Box>}
            {!loading && intent.client_secret && stripePromise && step === 1 &&
                <Elements stripe={stripePromise} options={{clientSecret: intent.client_secret}}>
                    <CheckoutForm handleChangeStep={handleChangeStep} handleCancel={handleCancel}/>
                </Elements>
            }
        </DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }