import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { Alert, Button, DialogActions } from '@mui/material';

const CheckoutForm = (props: any) => {
  let link = window.location.href;
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event: any) => {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <PaymentElement />
      <DialogActions sx={{mt: 3}}>
            <Button variant='outlined' onClick={props.handleCancel}>Cancel</Button>
            <Button variant='contained' onClick={handleSubmit} disabled={!stripe}>Submit</Button>
        </DialogActions>
      {/* Show error message to your customers */}
    </form>
  )
};

export default CheckoutForm;