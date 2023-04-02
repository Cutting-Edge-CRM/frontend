import { AddressAutofill } from '@mapbox/search-js-react';
import { AddCircleOutlineOutlined, DeleteOutline, EditOutlined, OpenInNew } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { updateSettings } from '../../api/settings.api';
import { retrieveAccount, startPaymentSetUp, continuePaymentSetUp } from '../../api/stripePayments.api';
import { listTaxes } from '../../api/tax.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import TaxModal from '../../shared/TaxModal';
// import StripePayments from './StripePayments'
// import StripePayouts from './StripePayouts';

const currencies = [{id: 'cad', display: 'CAD'}, {id: 'usd', display: 'USD'}];

function Payments(props: any) {
    const [setupStatus, setSetupStatus] = useState('not-started');
    const [loading, setLoading] = useState(false);
    const [loginLink, setLoginLink] = useState('');
    const [error, setError] = useState(null);
    const [taxes, setTaxes] = useState([] as any);
    // const [stripeLoaded, setStripeLoaded] = useState(false);
    const [taxModalOpen, setTaxModalOpen] = useState(false);
    const [taxGroup, setTaxGroup] = useState({} as any);
    const [taxModalType, setTaxModalType] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);

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
            props.success('Successfully updated settings');  
        }, err => {
            setError(err);
        })
    }


    const handleRemoveTaxGroup = (event: any, index: number) => {
        setTaxGroup(taxes[index]);
        setDeleteOpen(true);
      };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    }

    const handleAddTaxGroup = (event: any) => {
        setTaxModalType('New');
        setTaxGroup({title: "", taxes: [{title: '', tax: ''}]});
        setTaxModalOpen(true);
      };

    const handleEditTaxGroup = (event: any, index: number) => {
        setTaxModalType("Edit");
        setTaxGroup(taxes[index]);
        setTaxModalOpen(true);
    };

    useEffect(() => {
        setLoading(true);
        retrieveAccount()
        .then(res => {
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
        listTaxes()
        .then((result) => {
            // setLoading(false);
            setTaxes(result);
        }, (err) => {
            // setLoading(false);
            // setError(err.message);
        })
        }, [deleteOpen, taxModalOpen]);

    const handleTaxModalClose = () => {
        setTaxModalOpen(false);
    }

    // useEffect(() => {
    //     if (setupStatus !== 'complete') return;
    //     (window as any).StripeConnect = (window as any).StripeConnect || {};
    //       // Fetch the AccountSession client secret
    //       createAccountSession()
    //       .then((res) => {
    //         let clientSecret = res.client_secret;
    //         // Initialize StripeConnect after the window loads
    //         if (stripeLoaded) return;
    //         setStripeLoaded(true);
    //         (window as any).StripeConnect.onLoad = () => {
    //             (window as any).StripeConnect.init({
    //             // This is a placeholder - it should be replaced with your publishable API key.
    //             // Sign in to see your own test API key embedded in code samples.
    //             // Don’t submit any personally identifiable information in requests made with this key.
    //             publishableKey: process.env.REACT_APP_STRIPE_KEY as string,
    //             clientSecret,
    //             appearance: {
    //               colors: {
    //                 primary: '#0C8BE7',
    //               },
    //             },
    //             uiConfig: {
    //               overlay: 'dialog',
    //             }
    //           });
    //         };
    //         setError(null);

    //       }, (err: any) => {
    //         setError(err);
    //       })
    //   }, [stripeLoaded, setupStatus]);

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
                Tax Groups
            </InputLabel>
            {taxes.map((taxGroup: any, taxGroupIndex: number) => (
                <Stack key={taxGroupIndex}>
                <Stack direction={'row'}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="h6" fontWeight={600}>{taxGroup.title}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={(e) => handleEditTaxGroup(e, taxGroupIndex)}>
                                <EditOutlined color="primary" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={(e) => handleRemoveTaxGroup(e, taxGroupIndex)}>
                                <DeleteOutline color="error" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Stack>
                {taxGroup.taxes?.map((tax: any, index: number) => (
                    <Stack direction={'row'} key={index} spacing={1} marginLeft={2}>
                        <Typography variant="body2" fontStyle={'italic'} fontWeight={500}>{tax.title}</Typography>
                        <Typography variant="body2" fontWeight={500}>{tax.tax}%</Typography>
                    </Stack>
                ))}
                </Stack>
            ))}
            <Button
            sx={{ alignSelf: 'flex-start' }}
            onClick={handleAddTaxGroup}
            startIcon={<AddCircleOutlineOutlined color="primary" />}
            >
                Add Tax Group
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
            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        </Stack>
        </Card>
        {/* {setupStatus === "complete" &&
        <>
            <Card sx={{padding: 3}}>
            <StripePayments stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
            </Card>
            <Card sx={{padding: 3}}>
                <StripePayouts stripeLoaded={stripeLoaded} setStripeLoaded={setStripeLoaded} />
            </Card>
        </>
        } */}
        <TaxModal
        open={taxModalOpen}
        onClose={handleTaxModalClose}
        taxGroup={taxGroup}
        setTaxGroup={setTaxGroup}
        taxModalType={taxModalType}
        />
        <ConfirmDelete
        type={'tax'}
        onDelete={handleDeleteClose}
        onClose={handleDeleteClose}
        success={props.success}
        open={deleteOpen}
        deleteId={taxGroup.id}
        />
    </Stack>
    );
}

export default Payments;