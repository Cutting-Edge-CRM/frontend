import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { getCheckoutSession, getPortalSession } from '../../api/subscriptions.api';

function Billing(props: any) {

    const handleCheckout = (priceId: string) => {
        getCheckoutSession(priceId)
        .then(res => {
            window.location.replace(res.url);
        }, err => {
            console.error(err);
        })
    }

    const handlePortal = () => {
        getPortalSession().then(res => {
            window.location.replace(res.url);
        }, err => {
            console.error(err);
        })
    }


    return (
        <Stack>
            <Button onClick={() => handleCheckout("price_1MJLW5Keym0SOuzyP4lkwwuI")}>Team</Button>
            <Button onClick={() => handleCheckout("price_1MJLZaKeym0SOuzyq8CIDUOK")}>Enterprise</Button>
            <Button onClick={handlePortal}>Portal</Button>
        </Stack>
    );
}

export default Billing;