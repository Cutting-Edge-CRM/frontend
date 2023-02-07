import React, { useEffect, useState } from 'react';
import { createAccountSession } from '../../api/stripePayments.api';
import {Helmet} from "react-helmet-async";
import { InputLabel } from '@mui/material';

function StripePayments(props) {
    const [error, setError] = useState(null);

    useEffect(() => {
        window.StripeConnect = window.StripeConnect || {};
          // Fetch the AccountSession client secret
          createAccountSession()
          .then((res) => {
            console.log(res);
            let clientSecret = res.client_secret;
            // Initialize StripeConnect after the window loads
            window.StripeConnect.onLoad = () => {
                window.StripeConnect.init({
                // This is a placeholder - it should be replaced with your publishable API key.
                // Sign in to see your own test API key embedded in code samples.
                // Don’t submit any personally identifiable information in requests made with this key.
                publishableKey: "pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww",
                clientSecret,
                appearance: {
                  colors: {
                    primary: '#0C8BE7',
                  },
                },
                uiConfig: {
                  overlay: 'dialog',
                }
              });
            };
            setError(null);

          }, (err) => {
            setError(err);
          })
      }, []);


    return (
    <>
    <Helmet>
        <script async src="https://b.stripecdn.com/connect-js/v0.1/connect.js"></script>
    </Helmet>
    <div className="container" style={{fontFamily: "'Poppins', sans-serif"}}>
        {error ? 'Something went wrong!' :(
        <>
        <InputLabel id="tax-label" sx={{ color: 'primary.main', textAlign: 'center' }}>
            Payments
        </InputLabel>
        <stripe-connect-payments />
        </>
        )}
    </div>
    </>
    );
}

export default StripePayments;