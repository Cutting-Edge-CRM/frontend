import { AddressAutofill } from '@mapbox/search-js-react';
import { AddCircleOutlineOutlined, DeleteOutline, OpenInNew, Percent } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
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
            window.location.replace(res.url);
            setLoading(false);

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
            console.log(res);
            setLoading(false);
            if (!res.stripeRes?.id) {
                console.log('not started');
                setSetupStatus('not-started');
            } else if (!res.stripeRes?.charges_enabled) {
                console.log('incomplete');
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
        if (setupStatus !== 'complete') return;
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
      }, [stripeLoaded, setupStatus]);

    if (loading) return (<Box textAlign='center'><CircularProgress /></Box>);

    return (
    <Stack spacing={2}>
        <Card sx={{padding: 3}}>
            {/* for a very strange reason putting this making it style properly on mobile */}
            <AddressAutofill accessToken=''>
            <TextField sx={{display:'none'}} />
            </AddressAutofill>
        <Grid container sx={{mb: 3}}>
            <Grid item xs={12} sm={6} padding={3}>
            <Stack spacing={2}>
            <InputLabel id="currency-label" sx={{ color: 'primary.main' }}>
                Currency
            </InputLabel>
            <Select
                labelId="currency-label"
                id="currency"
                sx={{width: "80%"}}
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
                        <DeleteOutline color="error" />
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
            <Grid item xs={12} sm={6} padding={3}>
            <Box
            sx={{
                backgroundColor: 'default.light',
                borderRadius: '10px',
                p: 2,
                cursor: 'pointer',
                borderColor: 'default.main',
                border: "1px solid",
                justifyContent: 'center',
                height: "100%"
            }}
            >
            
            <Box alignItems={'center'} display={'flex'} flexDirection={'column'}>
                {error && <Alert severity="error">{error}</Alert>}
                {setupStatus === 'not-started' && 
                <>
                <IconButton onClick={handleStartSetUp}>
                    <OpenInNew fontSize='large' color='primary'/>
                </IconButton>
                <Typography variant="body2" color="default.main" width={"60%"} textAlign={"center"} marginBottom={2}>
                    Get paid faster! Set up payments in the payment portal to allow customers to pay via credit card and have the money deposited straight to your account.
                </Typography>
                <Button variant='contained' onClick={handleStartSetUp}>Set Up Payments</Button>
                </>
                }
                {setupStatus === 'incomplete' && 
                <>
                <IconButton onClick={handleContinueSetUp}>
                    <OpenInNew fontSize='large' color='primary'/>
                </IconButton>
                <Typography variant="body2" color="default.main" width={"60%"} textAlign={"center"} marginBottom={2}>
                    Get paid faster! Set up payments in the payment portal to allow customers to pay via credit card and have the money deposited straight to your account.
                </Typography>
                <Button variant='contained' onClick={handleContinueSetUp}>Set Up Payments</Button>
                </>
                }
                {setupStatus === 'complete' && 
                <>
                <IconButton onClick={handleDashboard}>
                    <OpenInNew fontSize='large' color='primary'/>
                </IconButton>
                <Typography variant="body2" color="default.main" width={"60%"} textAlign={"center"} marginBottom={2}>
                    Visit the dashboard to view analytics, change your bank account settings, get instant payouts, and more!
                </Typography>
                <Button variant='contained' onClick={handleDashboard}>Visit Dashboard</Button>
                </>
                }
            </Box>
            </Box>
            </Grid>
        </Grid>
        <Stack direction={'row'} spacing={2} justifyContent='center'>
            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        </Stack>
        </Card>
        {setupStatus === "complete" &&
        <>
            <Card sx={{padding: 3}}>
            <StripePayments stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
            </Card>
            <Card sx={{padding: 3}}>
                <StripePayouts stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
            </Card>
        </>
        }
        
    </Stack>
    );
}

export default Payments;