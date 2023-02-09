import React, { useState } from 'react';
import {Helmet} from "react-helmet-async";
import { InputLabel } from '@mui/material';

function StripePayments(props) {
    const [error] = useState(null);

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