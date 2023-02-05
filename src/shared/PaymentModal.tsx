import { AttachMoney } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import {
  deletePayment,
  recordPayment,
  updatePayment,
} from '../api/payment.api';
import { createDeposit, createPayment } from '../api/stripePayments.api';
import { createTimeline } from '../api/timeline.api';
import CheckoutForm from '../pages/client-hub/CheckoutForm';

export default function PaymentModal(props: any) {
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState({} as any);
  const [stripePromise, setStripePromise] = useState(null as any);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Cheque',
    'Credit Card',
    'Money Order',
    'Other',
  ];

  const handleCancel = () => {
    props.onClose();
  };

  const handleSave = () => {
    if (props.type === 'new') {
      recordPayment(props.payment).then(
        (res) => {
          let timeline_event = {
            client: props.payment.client,
            resourceId: res.id,
            resourceType: props.paymentType?.toLowerCase(),
            resourceAction: 'created'
          };
          createTimeline(timeline_event);
          props.onClose();
          props.success('Successfully recorded payment');
        },
        (err) => {}
      );
    }
    if (props.type === 'edit') {
      updatePayment(props.payment).then(
        (res) => {
          props.onClose();
          props.success('Successfully updated payment record');
        },
        (err) => {}
      );
    }
  };

  const handleSaveAndReciept = () => {};

  const handleDelete = () => {
    deletePayment(props.payment.id).then(
      (res) => {
        props.onClose();
        props.success('Successfully deleted payment record');
      },
      (err) => {}
    );
  };

  const handleChange = (event: any) => {
    props.setPayment({
      ...props.payment,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleChangeMethod = (event: any) => {
    props.setPayment({ ...props.payment, method: event.target.value.trim() });
  };

  const handlePaymentDateChange = (date: any) => {
    props.setPayment({ ...props.payment, transDate: date });
  };

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
    if (props.paymentType === 'Deposit') {
        createDeposit(props.quote.quote.client, props.quote.quote.id, (+(+props.payment.amount).toFixed(2)))
        .then(intent => {
            loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww").then(loadStripe => {
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
        createPayment(props.invoice.invoice.client, props.invoice.invoice.id, (+(+props.payment.amount).toFixed(2)))
        .then(intent => {
            loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww").then(loadStripe => {
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

  return (
    <Dialog onClose={handleCancel} open={props.open}>
      <DialogTitle align="center">Collect {props.paymentType}</DialogTitle>
      {error && <Alert severity="error">{error}</Alert>}
      {props.payment.method !== 'Credit Card' &&
      <>
      <DialogContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <InputLabel id="method-label" sx={{ color: 'primary.main' }}>
              Payment Method
            </InputLabel>
            <Select
              labelId="method-label"
              id="method"
              value={props.payment.method}
              onChange={handleChangeMethod}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected}
                </Box>
              )}
            >
              {paymentMethods.map((method: any) => (
                <MenuItem key={method} value={method}>
                  <Checkbox checked={method === props.payment.method} />
                  <ListItemText primary={method} />
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <InputLabel id="amount-label" sx={{ color: 'primary.main' }}>
              Amount
          </InputLabel>
          <TextField
            id="amount"
            defaultValue={
              props.payment.amount ? props.payment.amount : undefined
            }
            onChange={handleChange}
            type='number'
            error={props.payment?.amount === '0'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <InputLabel id="date-label" sx={{ color: 'primary.main' }}>
              Payment Date
          </InputLabel>
          <DatePicker
            value={props.payment.transDate}
            onChange={handlePaymentDateChange}
            renderInput={(params) => <TextField {...params} />}
            OpenPickerButtonProps={{
              color: 'primary',
            }}
          />
          <InputLabel id="details-label" sx={{ color: 'primary.main' }}>
              Details
          </InputLabel>
          <TextField
            multiline
            minRows={3}
            id="details"
            defaultValue={
              props.payment.details ? props.payment.details : ''
            }
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        {props.type === 'edit' && (
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        )}
        <Button onClick={handleSaveAndReciept}>Save & Email Receipt</Button>
        <Button onClick={handleSave} disabled={!props.payment.amount || props.payment?.amount === '0'} variant="contained">
          Save
        </Button>
      </DialogActions>
      </>}
      {props.payment.method === 'Credit Card' &&
        <DialogContent>
          <Stack spacing={2}>
          {step === 0 &&
          <>
          <Stack spacing={1}>
          <InputLabel id="method-label" sx={{ color: 'primary.main' }}>
            Payment Method
          </InputLabel>
          <Select
            labelId="method-label"
            id="method"
            value={props.payment.method}
            onChange={handleChangeMethod}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected}
              </Box>
            )}
          >
            {paymentMethods.map((method: any) => (
              <MenuItem key={method} value={method}>
                <Checkbox checked={method === props.payment.method} />
                <ListItemText primary={method} />
              </MenuItem>
            ))}
          </Select>
          </Stack>
          <InputLabel id="amount-label" sx={{ color: 'primary.main' }}>
              Amount
          </InputLabel>
          <TextField
              id="amount"
              value={
                props.payment.amount ? props.payment.amount : ''
              }
              onChange={handleChange}
              type='number'
              error={props.payment?.amount === '0'}
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
              <Button variant='contained' onClick={handleChangeStep} disabled={!props.payment.amount || props.payment?.amount === '0'}>Continue</Button>
          </DialogActions>
          </>
          }
          {loading && <Box textAlign='center'><CircularProgress /></Box>}
          {!loading && intent.client_secret && stripePromise && step === 1 &&
          <>
            <Stack spacing={1}>
              <InputLabel id="method-label" sx={{ color: 'primary.main' }}>
                Payment Method
              </InputLabel>
              <Select
                labelId="method-label"
                id="method"
                value={props.payment.method}
                onChange={handleChangeMethod}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected}
                  </Box>
                )}
              >
                {paymentMethods.map((method: any) => (
                  <MenuItem key={method} value={method}>
                    <Checkbox checked={method === props.payment.method} />
                    <ListItemText primary={method} />
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Elements stripe={stripePromise} options={{clientSecret: intent.client_secret}}>
                <CheckoutForm handleChangeStep={handleChangeStep} handleCancel={handleCancel}/>
            </Elements>
            </>
          }
          </Stack>
        </DialogContent>
            }
    </Dialog>
  );
}