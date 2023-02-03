import { AddressAutofill } from '@mapbox/search-js-react';
import { Email, Person, Phone, Place } from '@mui/icons-material';
import { Button, Card, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

function PersonalInformation(props: any) {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({} as any);

    const handleChange = (event: any) => {
        setSettings({ ...settings, [event.target.id]: event.target.value });
      };

    return (
        <>
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
                            defaultValue={
                            settings.first ? settings.first : undefined
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
                            defaultValue={settings.phone ? settings.phone : undefined}
                            onChange={props.handleChangeProperty}
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
                            defaultValue={
                            settings.last ? settings.last : undefined
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
                            defaultValue={
                            settings.email ? settings.email : undefined
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
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Save Changes</Button>
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
                            defaultValue={
                            settings.address ? settings.address : undefined
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
                            defaultValue={settings.city ? settings.city : undefined}
                            onChange={props.handleChangeProperty}
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
                            defaultValue={settings.zip ? settings.zip : undefined}
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
                            defaultValue={
                            settings.address2 ? settings.address2 : undefined
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
                            defaultValue={
                            settings.state ? settings.state : undefined
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
                            defaultValue={
                            settings.country ? settings.country : undefined
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
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Save Changes</Button>
            </Stack>
        </Card>
        </>
    )
}

export default PersonalInformation;