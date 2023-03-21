import { AddressAutofill } from '@mapbox/search-js-react';
import { AddAPhoto, Close, Email, Language, MapsHomeWork, Phone, Place } from '@mui/icons-material';
import { Alert, Box, Button, Card, Divider, Grid, IconButton, ImageListItem, InputAdornment, InputLabel, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { updateCompany } from '../../api/company.api';
import { saveImagesCloudinary } from '../../api/images.api';

function CompanyInformation(props: any) {
    const [error, setError] = useState(null);
    const [loadingFiles, setLoadingFiles] = useState(false);
    

    const handleChange = (event: any) => {
        props.setCompany({ ...props.company, [event.target.id]: event.target.value });
      };

    const handleSave = () => {
        if (props.fileURLs?.[0]?.url !== props.company?.logo) {
            saveImagesCloudinary(props.fileURLs).then(
              (res) => {
                props.setCompany({...props.company, logo: res?.[0]?.url});
                updateCompany({...props.company, logo: res?.[0]?.url})
                    .then(res => {
                        props.success('Successfully updated company');   
                    }, err => {
                        setError(err);
                    })
              },
              (err) => {
                setError(err.message);
                console.log('error' + err.message);
              }
            );
          } else {
            updateCompany(props.company)
            .then(res => {
                props.success('Successfully updated company');   
            }, err => {
                setError(err);
            })
          }

    }

    // const handleReload = () => {
    //     window.location.reload();
    // }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
          const readAsDataURL = (files: File[]) => {
            setLoadingFiles(true);
            fileToDataURL(files[0]).then((file) => {
              setLoadingFiles(false);
              props.setFileURLs([file] as { url: string; file: File }[]);
            });
          };
          readAsDataURL(acceptedFiles);
        },
        [props]
      );
    
      let { getRootProps, getInputProps, isDragActive } =
        useDropzone({
          accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/tiff': ['.tif', '.tiff'],
            'image/svg+xml': ['.svg'],
            'image/webp': ['.webp'],
          },
          maxFiles: 1,
          onDrop,
        });
    
      const handleDelete = () => {
        props.setFileURLs([]);
      };
    
      const fileToDataURL = (file: File) => {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
          reader.onload = function (event) {
            resolve({ url: event.target?.result, file: file });
          };
          reader.readAsDataURL(file);
        });
      };

    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
        <Card sx={{ py: 3 }}>
            <Stack>
                <Typography align={'center'} variant="h6" marginBottom={2}>Company Information</Typography>
                <Grid container>
                    <Grid xs={12} sm={6} paddingX={3}>
                        <InputLabel id="name-label" sx={{ color: 'primary.main' }}>
                            Company Name
                        </InputLabel>
                        <TextField
                            id="companyName"
                            value={props.company.companyName ? props.company.companyName : ''}
                            onChange={handleChange}
                            fullWidth
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
                            fullWidth
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
                            fullWidth
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
                            fullWidth
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Language color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} spacing={1} paddingX={3}>
                        <InputLabel id="logo-label" sx={{ color: 'primary.main' }}>
                            Logo
                        </InputLabel>
                        <Box>
                            <Box
                            {...getRootProps()}
                            sx={{
                                backgroundColor: 'default.light',
                                borderRadius: '10px',
                                p: 2,
                                cursor: 'pointer',
                                border: '1px dashed',
                                borderColor: 'default.main',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            >
                            {props.fileURLs.length === 0 &&
                                <>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <Typography variant="body2">Drop the files here ...</Typography>
                                ) : (
                                    <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={1.5}
                                    >
                                    <AddAPhoto color="primary" fontSize="large" />
                                    <Typography variant="body2" color="default.main">
                                        Drop an image file here. Ensure the image is square for proper formatting.
                                    </Typography>
                                    <Divider>
                                        <Typography variant="body2" color="default.main">
                                        Or
                                        </Typography>
                                    </Divider>
                                    <Button>Browse files</Button>
                                    </Stack>
                                )}
                                </>
                                }
                                {props.fileURLs.length > 0 &&
                                    <Box>
                                    <IconButton onClick={() => handleDelete()}>
                                        <Close />
                                    </IconButton>
                                    <ImageListItem>
                                        <img src={props.fileURLs?.[0]?.url} alt="company logo" />
                                    </ImageListItem>
                                    </Box>
                            }
                            </Box>
                            {loadingFiles && <LinearProgress />}
                        </Box>
                    </Grid>
                </Grid>
                <Stack direction={'row'} justifyContent='center' spacing={2} marginTop={3}>
                    {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                </Stack>
            </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
            <Typography align='center' variant="h6" marginBottom={2}>Address</Typography>
            <form>
            <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}>
            <Grid container paddingX={5} spacing={2}>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                            Address
                        </InputLabel>
                        <TextField
                            id="address"
                            autoComplete="street-address"
                            value={
                            props.company.address ? props.company.address : ''
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
                            props.company.address2 ? props.company.address2 : ''
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
                            value={props.company.city ? props.company.city : ''}
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
                            props.company.state ? props.company.state : ''
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
                            value={props.company.zip ? props.company.zip : ''}
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
                            props.company.country ? props.company.country : ''
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
            <Stack direction={'row'} spacing={2} justifyContent='center' marginTop={3}>
                {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Stack>
        </Card>
        </>
    )
}

export default CompanyInformation;