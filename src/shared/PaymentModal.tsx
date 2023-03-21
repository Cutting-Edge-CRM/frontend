import { AttachMoney, Close } from '@mui/icons-material';
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
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deletePayment,
  recordPayment,
  updatePayment,
} from '../api/payment.api';
import { createDeposit, createPayment, retrieveAccount } from '../api/stripePayments.api';
import { createTimeline } from '../api/timeline.api';
import CheckoutForm from '../pages/client-hub/CheckoutForm';
import { theme } from '../theme/theme';

export default function PaymentModal(props: any) {
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState({} as any);
  const [stripePromise, setStripePromise] = useState(null as any);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [paymentsSetup, setPaymentsSetup] = useState(false);
  const navigate = useNavigate();

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
          props.setReload(!props.reload);
        },
        (err) => {}
      );
    }
    if (props.type === 'edit') {
      updatePayment(props.payment).then(
        (res) => {
          props.onClose();
          props.success('Successfully updated payment record');
          props.setReload(!props.reload);
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
            loadStripe(process.env.REACT_APP_STRIPE_KEY as string).then(loadStripe => {
                setStripePromise(loadStripe);
                setIntent(intent);
                setLoading(false);
                props.setReload(!props.reload);
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
            loadStripe(process.env.REACT_APP_STRIPE_KEY as string).then(loadStripe => {
                setStripePromise(loadStripe);
                setIntent(intent);
                setLoading(false);
                props.setReload(!props.reload);
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
  retrieveAccount()
  .then(res => {
      if (res.stripeRes?.charges_enabled) {
        setPaymentsSetup(true);
      }
  }, err => {
      setError(err.message);
  })
}, [])

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
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
        {props.type === 'edit' && (
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        )}
        <Button onClick={handleSaveAndReciept} variant="outlined">Send Receipt</Button>
        <Button onClick={handleSave} disabled={!props.payment.amount || props.payment?.amount === '0'} variant="contained">
          Save
        </Button>
      </DialogActions>
      </>}
      {props.payment.method === 'Credit Card' &&
        <DialogContent>
          <Stack spacing={2}>
          {step === 0 && paymentsSetup &&
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
          {step === 0 && !paymentsSetup && 
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
          <Stack alignItems={'center'} spacing={2} my={4}>
            <Typography fontSize={20} fontWeight={600}>Get paid faster!</Typography>
            <Typography fontSize={14} fontWeight={500}>Allow your customers to pay via credit card and have it directly deposited in your bank account.</Typography>
            <Button variant='contained' onClick={() => navigate('/settings?tab=payments')}>Set Up</Button>
          </Stack>
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