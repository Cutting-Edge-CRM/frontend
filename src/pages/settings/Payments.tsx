import { AddCircleOutlineOutlined, DeleteOutline, Percent } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { updateSettings } from '../../api/settings.api';
import { retrieveAccount, startPaymentSetUp, continuePaymentSetUp, createAccountSession } from '../../api/stripePayments.api';
import { updateTaxes } from '../../api/tax.api';
import StripePayments from './StripePayments'
import StripePayouts from './StripePayouts';

const currencies = [{id: 'cad', display: 'CAD'}, {id: 'usd', display: 'USD'}];

function Payments(props: any) {
    const [setupStatus, setSetupStatus] = useState('not-started');
    const [loading, setLoading] = useState(false);
    const [loginLink, setLoginLink] = useState('');
    const [error, setError] = useState(null);
    const [stripeLoaded, setStripeLoaded] = useState(false);

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

    const handleChangeCurrency = (event: any) => {
        props.setSettings({...props.settings, currency: event.target.value});
    }

    const handleSave = () => {
        updateSettings(props.settings)
        .then(res => {
            updateTaxes(props.taxes)
            .then(taxRes => {
                props.success('Successfully updated settings');   
            }, err => {
                setError(err);
            })
        }, err => {
            setError(err);
        })
    }

    const handleReload = () => {
        window.location.reload();
    }

    const handleChangeTax = (event: any, index: number) => {
        let newTaxes = props.taxes?.taxes;
        newTaxes[index][event.target.id] = event.target.value;
        props.setTaxes({taxes: newTaxes});
      };
    
      const handleRemoveTax = (event: any, index: number) => {
        let newTaxes = props.taxes?.taxes;
        newTaxes = newTaxes
          .slice(undefined, index)
          .concat(newTaxes.slice(index + 1, undefined));
          props.setTaxes({taxes: newTaxes});
      };
    
      const handleAddTax = (event: any) => {
        let newTaxes = props.taxes?.taxes;
        newTaxes.push({tax: '', title: ''});
        props.setTaxes({taxes: newTaxes});
      };

    useEffect(() => {
        setLoading(true);
        retrieveAccount()
        .then(res => {
            setLoading(false);
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

    useEffect(() => {
        (window as any).StripeConnect = (window as any).StripeConnect || {};
          // Fetch the AccountSession client secret
          createAccountSession()
          .then((res) => {
            let clientSecret = res.client_secret;
            // Initialize StripeConnect after the window loads
            if (stripeLoaded) return;
            setStripeLoaded(true);
            (window as any).StripeConnect.onLoad = () => {
                (window as any).StripeConnect.init({
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

          }, (err: any) => {
            setError(err);
          })
      }, [stripeLoaded]);

    if (loading) return (<Box textAlign='center'><CircularProgress /></Box>);

    return (
    <Stack spacing={2}>
        <Card sx={{padding: 3}}>
        <Box textAlign={'center'}>
            {error && <Alert severity="error">{error}</Alert>}
            {setupStatus === 'not-started' && <Button variant='contained' onClick={handleStartSetUp}>Set Up Payments</Button>}
            {setupStatus === 'incomplete' && <Button variant='contained' onClick={handleContinueSetUp}>Set Up Payments</Button>}
            {setupStatus === 'complete' && <Button variant='contained' onClick={handleDashboard}>Visit Dashboard</Button>}
        </Box>
        <Grid container sx={{mb: 3}}>
            <Grid item xs={4} padding={3}>
            <Stack spacing={2}>
            <InputLabel id="currency-label" sx={{ color: 'primary.main' }}>
                Currency
            </InputLabel>
            <Select
                labelId="currency-label"
                id="currency"
                value={props.settings.currency ? props.settings.currency : 'usd'}
                onChange={handleChangeCurrency}
                renderValue={(selected) => (
                <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                >
                    {currencies.find(c => c.id === selected)?.display}
                </Box>
                )}
                size="small"
            >
                {currencies.map((curr: any) => (
                <MenuItem key={curr.id} value={curr.id}>
                    <ListItemText primary={curr.display} />
                </MenuItem>
                ))}
            </Select>
            <InputLabel id="tax-label" sx={{ color: 'primary.main' }}>
                Tax Rates
            </InputLabel>
            {props.taxes?.taxes?.map((tax: any, index: number) => (
                <Stack key={index} direction='row' spacing={2}>
                    <TextField
                        id="title"
                        value={tax.title}
                        label="Name"
                        onChange={(e) => handleChangeTax(e, index)}
                    />
                    <TextField
                        id="tax"
                        value={tax.tax}
                        label="Rate (%)"
                        onChange={(e) => handleChangeTax(e, index)}
                        InputProps={{
                            endAdornment: (
                                <Percent />
                            ),
                          }}
                    />
                    <IconButton onClick={(e) => handleRemoveTax(e, index)}>
                        <DeleteOutline />
                    </IconButton>
                </Stack>
            ))}
            <Button
            sx={{ alignSelf: 'flex-start' }}
            onClick={handleAddTax}
            startIcon={<AddCircleOutlineOutlined color="primary" />}
            >
                Add Tax Rate
            </Button>
            </Stack>
            </Grid>
        </Grid>
        <Stack direction={'row'} spacing={2} justifyContent='center'>
            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        </Stack>
        </Card>
        <Card sx={{padding: 3}}>
            <StripePayments stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
        </Card>
        <Card sx={{padding: 3}}>
            <StripePayouts stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
        </Card>
    </Stack>
    );
}

export default Payments;