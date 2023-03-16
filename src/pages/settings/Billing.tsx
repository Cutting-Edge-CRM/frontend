import { AddressAutofill } from '@mapbox/search-js-react';
import { CheckCircleOutline, PeopleOutlineOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, Grid, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { getCheckoutSession, getPortalSession } from '../../api/subscriptions.api';

const basicFeatures = ["Client Manager", "Quoting & Estimating", "Invoicing", "Client Portal", "Email & Text Message", "Credit Card Processing", "Dashboard & Analytics"] 
const teamFeatures = ["Job Scheduling", "Appointments & Reminders", "Employee Login", "Time Tracking"] 


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
            console.log(res);
            window.location.replace(res.url);
        }, err => {
            console.error(err);
        })
    }

    return (
        <Card sx={{ py: 3 }}>
            {/* for a very strange reason putting this making it style properly on mobile */}
            <AddressAutofill accessToken=''>
            <TextField sx={{display:'none'}} />
            </AddressAutofill>
            <Stack>
                <Typography textAlign={'center'} my={8} color='neutral.main' fontWeight={600} fontSize={18} >Available Plans</Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} sm={4} >
                        <Card sx={{height: '100%'}}>
                            <Stack direction={'row'} justifyContent={'space-between'} alignItems="center" mx='-20px' px="40px" py="14px" sx={{backgroundColor: '#9ED1F580'}}>
                                <Typography fontWeight={600} fontSize={18}>Basic</Typography>
                                {props.subscription.subscription === 'basic' && <Chip label="Active" sx={{backgroundColor: "blue.dark"}} />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'}>
                                        <Typography fontWeight={600} fontSize={30}>Free</Typography>
                                    </Stack>
                                    <Stack spacing={2} height="380px">
                                        {basicFeatures.map((feature: string, index: number) => (
                                            <Grid container key={index}>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography>{feature}</Typography>
                                            </Grid>
                                            </Grid>
                                        ))}
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography>4.9% Credit Card Fee</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <PeopleOutlineOutlined />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography fontStyle={'italic'}>Max 1 user</Typography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    {props.subscription.subscription !== 'basic' && <Button variant='contained' onClick={handlePortal}>Downgrade</Button>}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <Card sx={{height: '100%'}}>
                            <Stack direction={'row'} justifyContent={'space-between'} alignItems="center" mx='-20px' px="40px" py="14px" sx={{backgroundColor: '#FFF5E1'}}>
                                <Typography fontWeight={600} fontSize={18}>Team</Typography>
                                {props.subscription.subscription === 'team' && <Chip label="Active" sx={{backgroundColor: "yellow.dark"}} />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'} spacing={2} alignItems="baseline">
                                        <Typography fontWeight={600} fontSize={30}>$99</Typography>
                                        <Typography fontWeight={500} fontSize={14}>per month</Typography>
                                    </Stack>
                                    <Stack spacing={2} height="380px">
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline color="primary" />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography fontStyle={'italic'} color="primary">Everything in basic, plus</Typography>
                                            </Grid>
                                        </Grid>
                                        {teamFeatures.map((feature: string, index: number) => (
                                            <Grid container key={index}>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography>{feature}</Typography>
                                            </Grid>
                                            </Grid>
                                        ))}
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography>2.9% Credit Card Fee</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <PeopleOutlineOutlined />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography fontStyle={'italic'}>Up to 5 Users</Typography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    {props.subscription.subscription === 'basic' && <Button variant='contained' onClick={() => handleCheckout("price_1MJLW5Keym0SOuzyP4lkwwuI")}>Upgrade</Button>}
                                    {props.subscription.subscription === 'team' && <Button variant='outlined' onClick={handlePortal}>Manage</Button>}
                                    {props.subscription.subscription === 'enterprise' && <Button variant='contained' onClick={handlePortal}>Downgrade</Button>}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <Card sx={{height: '100%'}}>
                            <Stack direction={'row'} justifyContent={'space-between'} alignItems="center" mx='-20px' px="40px" py="14px" sx={{backgroundColor: '#D9F3E5'}}>
                                <Typography fontWeight={600} fontSize={18}>Enterprise</Typography>
                                {props.subscription.subscription === 'enterprise' && <Chip label="Active" sx={{backgroundColor: "green.dark"}} />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'} spacing={2} alignItems="baseline">
                                        <Typography fontWeight={600} fontSize={30}>$249</Typography>
                                        <Typography fontWeight={500} fontSize={14}>per month</Typography>
                                    </Stack>
                                    <Stack spacing={2} height="380px">
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline color="primary" />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography fontStyle={'italic'} color="primary">Everything in team, plus</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <CheckCircleOutline/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography>2.9% Credit Card Fee</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={1}>
                                                <PeopleOutlineOutlined />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography fontStyle={'italic'}>Unlimited Users</Typography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    {props.subscription.subscription === 'basic' && <Button variant='contained' onClick={() => handleCheckout("price_1MJLZaKeym0SOuzyq8CIDUOK")}>Upgrade</Button>}
                                    {props.subscription.subscription === 'team' && <Button variant='contained' onClick={handlePortal}>Upgrade</Button>}
                                    {props.subscription.subscription === 'enterprise' && <Button variant='outlined' onClick={handlePortal}>Manage</Button>}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Card>
    );
}

export default Billing;