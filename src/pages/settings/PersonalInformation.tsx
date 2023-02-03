import { AddressAutofill } from '@mapbox/search-js-react';
import { Email, Person, Phone, Place } from '@mui/icons-material';
import { Alert, Button, Card, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material';
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

    const handleReload = () => {
        window.location.reload();
    }

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
            <Typography align='center'>Personal Information</Typography>
            <Stack m={4} >
                <Stack spacing={4} direction='row'>
                        <Stack width={'50%'} spacing={1}>
                        <InputLabel id="first-label" sx={{ color: 'primary.main' }}>
                            First Name
                        </InputLabel>
                        <TextField
                            id="first"
                            value={
                            user.first ? user.first : ''
                            }
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                            Phone
                        </InputLabel>
                        <TextField
                            id="phone"
                            value={user.phone ? user.phone : ''}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        </Stack>
                        <Stack width={'50%'}  spacing={1}>
                        <InputLabel id="last-label" sx={{ color: 'primary.main' }}>
                            Last Name
                        </InputLabel>
                        <TextField
                            id="last"
                            value={
                            user.last ? user.last : ''
                            }
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
                            Email
                        </InputLabel>
                        <TextField
                            id="email"
                            value={
                            user.email ? user.email : ''
                            }
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        </Stack>
                </Stack>
            </Stack>
            <Stack direction={'row'} spacing={2} justifyContent='center'>
                <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
            <Typography align='center'>Address</Typography>
            <Stack m={4} >
            <form>
              <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}>
                <Stack spacing={4} direction='row'>
                        <Stack width={'50%'} spacing={1}>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        <InputLabel id="city-label" sx={{ color: 'primary.main' }}>
                            City
                        </InputLabel>
                        <TextField
                            id="city"
                            autoComplete="address-level2"
                            value={user.city ? user.city : ''}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        <InputLabel id="zip-label" sx={{ color: 'primary.main' }}>
                            Postal Code
                        </InputLabel>
                        <TextField
                            id="zip"
                            autoComplete="postal-code"
                            value={user.zip ? user.zip : ''}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        </Stack>
                        <Stack width={'50%'}  spacing={1}>
                        <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                            Unit
                        </InputLabel>
                        <TextField
                            id="address2"
                            value={
                            user.address2 ? user.address2 : ''
                            }
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Place color="primary" />
                                    </InputAdornment>
                                ),
                                }}
                        />
                        </Stack>
                </Stack>
              </AddressAutofill>
            </form>
            </Stack>
            <Stack direction={'row'} spacing={2} justifyContent='center'>
                <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
        </Card>
        </>
    )
}

export default PersonalInformation;