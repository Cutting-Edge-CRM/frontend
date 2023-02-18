import { AddressAutofill } from '@mapbox/search-js-react';
import { CheckCircleOutline } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, Grid, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { getCheckoutSession, getPortalSession } from '../../api/subscriptions.api';

const basicFeatures = ["Lorem ipsum ergo fortei herts", "Lorem ipsum ergo fortei herts", "Lorem ipsum ergo fortei herts", "Lorem ipsum ergo fortei herts", "Lorem ipsum ergo fortei herts"] 

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
        console.log('portal');
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
                                {props.subscription.subscription === 'basic' && <Chip label="Active" />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'}>
                                        <Typography fontWeight={600} fontSize={30}>Free</Typography>
                                    </Stack>
                                    <Stack spacing={2}>
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
                                {props.subscription.subscription === 'team' && <Chip label="Active" />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'} spacing={2} alignItems="baseline">
                                        <Typography fontWeight={600} fontSize={30}>$99</Typography>
                                        <Typography fontWeight={500} fontSize={14}>per month</Typography>
                                    </Stack>
                                    <Stack spacing={2}>
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
                                {props.subscription.subscription === 'enterprise' && <Chip label="Active" />}
                            </Stack>
                            <CardContent>
                                <Stack spacing={5}>
                                    <Stack direction={'row'} spacing={2} alignItems="baseline">
                                        <Typography fontWeight={600} fontSize={30}>$249</Typography>
                                        <Typography fontWeight={500} fontSize={14}>per month</Typography>
                                    </Stack>
                                    <Stack spacing={2}>
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