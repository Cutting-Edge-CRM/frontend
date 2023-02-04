import React, {useState, useEffect} from 'react';
import { Alert, AlertColor } from '@mui/material';
import { useStripe } from '@stripe/react-stripe-js';

const PaymentStatus = () => {
    const stripe = useStripe();
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

  useEffect(() => {

    if (!stripe) {
        return;
      }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (clientSecret) {
        stripe.retrievePaymentIntent(clientSecret as string)
        .then(({paymentIntent}) => {
          // Inspect the PaymentIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
          switch (paymentIntent?.status) {
            case 'succeeded':
              setMessage('Success! Payment received.');
              setSeverity('success');
              break;
  
            case 'processing':
              setMessage("Payment processing. We'll update you when payment is received.");
              setSeverity('info');
              break;
  
            case 'requires_payment_method':
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              setMessage('Payment failed. Please try another payment method.');
              setSeverity('error');
              break;
  
            default:
              setMessage('Something went wrong.');
              setSeverity('error');
              break;
          }
        });
    }

  }, [stripe]);

  if (message !== '') {
    return (<Alert severity={severity as AlertColor}>{message}</Alert>);
  } else {
    return (<></>);
  }
};

export default PaymentStatus;