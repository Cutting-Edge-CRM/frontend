import { Box, Button, Card, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { retrieveAccount, startPaymentSetUp, continuePaymentSetUp } from '../../api/stripePayments.api';


function Payments(props: any) {
    const [setupStatus, setSetupStatus] = useState('not-started');
    const [loading, setLoading] = useState(false);
    const [loginLink, setLoginLink] = useState('');

    const handleStartSetUp = () => {
        setLoading(true);
        startPaymentSetUp()
        .then(res => {
            setLoading(false);
            console.log(res);
            window.location.replace(res.url);
        }, err => {
            setLoading(false);
            console.error(err);
        })
    }

    const handleContinueSetUp = () => {
        setLoading(true);
        continuePaymentSetUp()
        .then(res => {
            setLoading(false);
            console.log(res);
            window.location.replace(res.url);
        }, err => {
            setLoading(false);
            console.error(err);
        })
    }

    const handleDashboard = () => {
        window.location.replace(loginLink);
    }

    useEffect(() => {
        setLoading(true);
        retrieveAccount()
        .then(res => {
            setLoading(false);
            console.log(res);
            if (res.stripeRes?.id === null) {
                setSetupStatus('not-started');
            } else if (!res.stripeRes?.charges_enabled) {
                setSetupStatus('incomplete');
            } else {
                setSetupStatus('complete');
                setLoginLink(res.loginLink?.url)
            }
        }, err => {
            setLoading(false);
        })
    }, [])

    if (loading) return (<Box textAlign='center'><CircularProgress /></Box>);

    return (
    <Card sx={{ py: 3 }}>
        {setupStatus === 'not-started' && <Button onClick={handleStartSetUp}>Set Up Payments</Button>}
        {setupStatus === 'incomplete' && <Button onClick={handleContinueSetUp}>Set Up Payments</Button>}
        {setupStatus === 'complete' && <Button onClick={handleDashboard}>Visit Dashboard</Button>}
    </Card>);
}

export default Payments;