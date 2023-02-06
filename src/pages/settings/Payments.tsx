import { AddCircleOutlineOutlined, DeleteOutline, Percent } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { updateSettings } from '../../api/settings.api';
import { retrieveAccount, startPaymentSetUp, continuePaymentSetUp } from '../../api/stripePayments.api';
import { updateTaxes } from '../../api/tax.api';

const currencies = [{id: 'cad', display: 'CAD'}, {id: 'usd', display: 'USD'}];

function Payments(props: any) {
    const [setupStatus, setSetupStatus] = useState('not-started');
    const [loading, setLoading] = useState(false);
    const [loginLink, setLoginLink] = useState('');
    const [error, setError] = useState(null);

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
        <Stack direction={'row'}>
            <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {setupStatus === 'not-started' && <Button onClick={handleStartSetUp}>Set Up Payments</Button>}
            {setupStatus === 'incomplete' && <Button onClick={handleContinueSetUp}>Set Up Payments</Button>}
            {setupStatus === 'complete' && <Button onClick={handleDashboard}>Visit Dashboard</Button>}
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
            {props.taxes?.taxes.map((tax: any, index: number) => (
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
        </Stack>
        <Stack direction={'row'} spacing={2} justifyContent='center'>
                <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
    </Card>);
}

export default Payments;