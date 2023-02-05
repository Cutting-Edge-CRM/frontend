import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { Alert, Box, Button, CircularProgress, DialogActions } from '@mui/material';

const CheckoutForm = (props: any) => {
  let link = window.location.href;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event: any) => {
    setLoading(true);

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: link,
      },
    });
    if (error) {
      setErrorMessage(error.message as any);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {loading && <Box textAlign='center'><CircularProgress /></Box>}
      <PaymentElement />
      <DialogActions sx={{mt: 3}}>
            <Button variant='outlined' onClick={props.handleChangeStep}>Back</Button>
            <Button variant='contained' onClick={handleSubmit} disabled={!stripe}>Submit</Button>
        </DialogActions>
      {/* Show error message to your customers */}
    </form>
  )
};

export default CheckoutForm;