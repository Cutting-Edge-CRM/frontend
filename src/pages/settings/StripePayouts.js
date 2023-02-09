import React, { useState } from 'react';
import {Helmet} from "react-helmet-async";

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
        <stripe-connect-payouts></stripe-connect-payouts>
        </>
        )}
    </div>
    </>
    );
}

export default StripePayments;