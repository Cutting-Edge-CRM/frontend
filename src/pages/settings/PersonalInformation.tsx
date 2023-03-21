import { AddressAutofill } from '@mapbox/search-js-react';
import { Email, Person, Phone, Place } from '@mui/icons-material';
import { Alert, Button, Card, Grid, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '../../api/user.api';

function PersonalInformation(props: any) {
    const [error, setError] = useState(null);
    const [user, setUser] = useState({} as any);

    const handleChange = (event: any) => {
        setUser({ ...user, [event.target.id]: event.target.value });
      };

    const handleSave = () => {
        updateUser(user)
        .then(res => {
            props.success('Successfully updated user');   
        }, err => {
            setError(err);
        })
    }

    // const handleReload = () => {
    //     window.location.reload();
    // }

    useEffect(() => {
    getUser()
    .then((result) => {
        setUser(result);
    }, (err) => {
        setError(err.message);
    })
    }, []);

    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
        <Card sx={{ py: 3 }}>
            <Typography align='center' variant="h6" marginBottom={2}>Personal Information</Typography>
                <Grid container paddingX={5} spacing={2}>
                    <Grid item xs={12} sm={6} >
                    <InputLabel id="first-label" sx={{ color: 'primary.main' }}>
                            First Name
                        </InputLabel>
                        <TextField
                            id="first"
                            value={
                            user.first ? user.first : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                            Phone
                        </InputLabel>
                        <TextField
                            id="phone"
                            value={user.phone ? user.phone : ''}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <InputLabel id="last-label" sx={{ color: 'primary.main' }}>
                            Last Name
                        </InputLabel>
                        <TextField
                            id="last"
                            value={
                            user.last ? user.last : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
                            Email
                        </InputLabel>
                        <TextField
                            id="email"
                            value={
                            user.email ? user.email : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </Grid>
                </Grid>
            <Stack direction={'row'} spacing={2} marginTop={3} justifyContent='center'>
                {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
            <Typography align='center' variant="h6" marginBottom={2}>Address</Typography>
            <form>
            <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string} >
            <Grid container paddingX={5} spacing={2}>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                            Address
                        </InputLabel>
                        <TextField
                            id="address"
                            autoComplete="street-address"
                            value={
                            user.address ? user.address : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                            Unit
                        </InputLabel>
                        <TextField
                            id="address2"
                            value={
                            user.address2 ? user.address2 : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="city-label" sx={{ color: 'primary.main' }}>
                            City
                        </InputLabel>
                        <TextField
                            id="city"
                            autoComplete="address-level2"
                            value={user.city ? user.city : ''}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="state-label" sx={{ color: 'primary.main' }}>
                            State/Province
                        </InputLabel>
                        <TextField
                            id="state"
                            autoComplete="address-level1"
                            value={
                            user.state ? user.state : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} >
                <InputLabel id="zip-label" sx={{ color: 'primary.main' }}>
                            Postal Code
                        </InputLabel>
                        <TextField
                            id="zip"
                            autoComplete="postal-code"
                            value={user.zip ? user.zip : ''}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="country-label" sx={{ color: 'primary.main' }}>
                            Country
                        </InputLabel>
                        <TextField
                            id="country"
                            autoComplete="country-name"
                            value={
                            user.country ? user.country : ''
                            }
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                </Grid>
            </Grid>
            </AddressAutofill>
            </form>
            <Stack direction={'row'} spacing={2} marginTop={3} justifyContent='center'>
                {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
        </Card>
        </>
    )
}

export default PersonalInformation;