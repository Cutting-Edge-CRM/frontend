import { AddressAutofill } from '@mapbox/search-js-react';
import { AddAPhoto, Email, Language, MapsHomeWork, Phone, Place } from '@mui/icons-material';
import { Alert, Box, Button, Card, Divider, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { updateCompany } from '../../api/company.api';

function CompanyInformation(props: any) {
    const [error, setError] = useState(null);

    const handleChange = (event: any) => {
        props.setCompany({ ...props.company, [event.target.id]: event.target.value });
      };

    const handleSave = () => {
        updateCompany(props.company)
        .then(res => {
            props.success('Successfully updated company');   
        }, err => {
            setError(err);
        })
    }

    const handleReload = () => {
        window.location.reload();
    }

    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
        <Card sx={{ py: 3 }}>
            <Stack>
                <Typography align={'center'}>Company Information</Typography>
                <Stack direction={'row'}>
                    <Stack width='50%' margin={3} spacing={1}>
                        <InputLabel id="name-label" sx={{ color: 'primary.main' }}>
                            Company Name
                        </InputLabel>
                        <TextField
                            id="companyName"
                            value={props.company.companyName ? props.company.companyName : ''}
                            onChange={handleChange}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MapsHomeWork color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                        <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                            Phone
                        </InputLabel>
                        <TextField
                            id="phone"
                            defaultValue={props.company.phone ? props.company.phone : undefined}
                            onChange={handleChange}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                        <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
                            Email
                        </InputLabel>
                        <TextField
                            id="email"
                            defaultValue={props.company.email ? props.company.email : undefined}
                            onChange={handleChange}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                        <InputLabel id="website-label" sx={{ color: 'primary.main' }}>
                            Website
                        </InputLabel>
                        <TextField
                            id="website"
                            defaultValue={props.company.website ? props.company.website : undefined}
                            onChange={handleChange}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Language color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                    </Stack>
                    <Stack width='50%' margin={3} spacing={1}>
                        <InputLabel id="logo-label" sx={{ color: 'primary.main' }}>
                            Logo
                        </InputLabel>
                        <Box>
                            <Box
                            // {...getRootProps()}
                            sx={{
                                backgroundColor: 'default.light',
                                borderRadius: '10px',
                                p: 2,
                                cursor: 'pointer',
                                border: '1px dashed',
                                borderColor: 'default.main',
                            }}
                            >
                            {/* <input {...getInputProps()} /> */}
                            {/* {isDragActive ? (
                                <Typography variant="body2">Drop the files here ...</Typography>
                            ) : ( */}
                                <Stack
                                justifyContent="center"
                                alignItems="center"
                                spacing={1.5}
                                >
                                <AddAPhoto color="primary" fontSize="large" />
                                <Typography variant="body2" color="default.main">
                                    Drop an image file here
                                </Typography>
                                <Divider>
                                    <Typography variant="body2" color="default.main">
                                    Or
                                    </Typography>
                                </Divider>
                                <Button>Browse files</Button>
                                </Stack>
                            {/* )} */}
                            </Box>
                            {/* {loadingFiles && <LinearProgress />}
                            <ImageList cols={3} rowHeight={164}>
                            {props.fileURLs.map((file: any) => (
                                <Box key={file.url}>
                                <IconButton onClick={() => handleDelete(file)}>
                                    <Close />
                                </IconButton>
                                <ImageListItem> */}
                                    {/* eslint-disable-next-line */}
                                    {/* <img src={file.url} />
                                </ImageListItem>
                                </Box>
                            ))}
                            </ImageList> */}
                        </Box>
                    </Stack>
                </Stack>
                <Stack direction={'row'} justifyContent='center' spacing={2}>
                    <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                </Stack>
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
                            props.company.address ? props.company.address : undefined
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
                            defaultValue={props.company.city ? props.company.city : undefined}
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
                            defaultValue={props.company.zip ? props.company.zip : undefined}
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
                            props.company.address2 ? props.company.address2 : undefined
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
                            props.company.state ? props.company.state : undefined
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
                            props.company.country ? props.company.country : undefined
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

export default CompanyInformation;