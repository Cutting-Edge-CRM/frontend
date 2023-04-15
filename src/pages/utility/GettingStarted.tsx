import { AddressAutofill } from '@mapbox/search-js-react';
import { AddAPhoto, Close, Email, Language, MapsHomeWork, Phone, Place, RocketLaunch } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Divider, Grid, IconButton, ImageListItem, InputAdornment, InputLabel, LinearProgress, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { getCompany, updateCompany } from '../../api/company.api';
import { saveImagesCloudinary } from '../../api/images.api';
import { theme } from '../../theme/theme';


function GettingStarted() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [companyInfo, setCompanyInfo] = useState({} as any);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileURLs, setFileURLs] = useState([] as any);
  const [loading, setLoading] = useState(false);


  const handleChangeCompanyInfo = (e: any) => {
    setCompanyInfo({...companyInfo, [e.target.id]: e.target.value})
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const readAsDataURL = (files: File[]) => {
        setLoadingFiles(true);
        fileToDataURL(files[0]).then((file) => {
          setLoadingFiles(false);
          setFileURLs([file] as { url: string; file: File }[]);
        });
      };
      readAsDataURL(acceptedFiles);
    },
    []
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
    setFileURLs([]);
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

  useEffect(() => {
    getCompany()
    .then((result) => {
        setCompanyInfo(result);
    }, (err) => {
        setError(err.message);
    })
    }, []);

    const handleSave = () => {
        setLoading(true);
        if (fileURLs?.[0]?.url !== companyInfo?.logo) {
            saveImagesCloudinary(fileURLs).then(
              (res) => {
                updateCompany({...companyInfo, logo: res?.[0]?.url})
                    .then(res => {
                        navigate('/clients');
                        setLoading(false);
                    }, err => {
                        setError(err);
                    })
              },
              (err) => {
                setError(err.message);
                setLoading(false);
                console.log('error' + err.message);
              }
            );
          } else {
            updateCompany(companyInfo)
            .then(res => {
                navigate('/clients');
                setLoading(false);
            }, err => {
                setError(err);
            })
          }

    }
    

    return (
      <Grid container justifyContent={'center'} height="100%" display={'flex'} alignItems="center" sx={{backgroundColor: "backgroundColor.dark"}}>
      <Grid item xs={mobile ? 11 : 6}>
      <Card sx={{backgroundColor: "backgroundColor.light", marginY: 4}}>
        <CardContent>
            <Stack spacing={1}>
                <Stack alignItems={'center'} spacing={2} my={4}>
                    <RocketLaunch color='primary' sx={{fontSize: "72px"}}/>
                    <Typography fontSize={20} fontWeight={600}>Getting Started</Typography>
                    <Typography fontSize={14} fontWeight={500}>Let's grab a bit more info to get you up and running!</Typography>
                </Stack>
                <Grid container>
                    <Grid item xs={12} sm={6} paddingX={ mobile ? 0 : 3}>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <InputLabel id="name-label" sx={{ color: 'primary.main' }}>
                            Company Name
                        </InputLabel>
                        <TextField
                            id="companyName"
                            value={companyInfo.companyName ? companyInfo.companyName : ''}
                            onChange={handleChangeCompanyInfo}
                            fullWidth
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MapsHomeWork color="primary" />
                                </InputAdornment>
                            ),
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
                            Company Phone
                        </InputLabel>
                        <TextField
                            id="phone"
                            value={companyInfo.phone ? companyInfo.phone : ''}
                            onChange={handleChangeCompanyInfo}
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
                        <Grid item xs={12}>
                        <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
                            Company Email
                        </InputLabel>
                        <TextField
                            id="email"
                            value={companyInfo.email ? companyInfo.email : ''}
                            onChange={handleChangeCompanyInfo}
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
                        <Grid item xs={12}>
                        <InputLabel id="website-label" sx={{ color: 'primary.main' }}>
                            Company Website
                        </InputLabel>
                        <TextField
                            id="website"
                            value={companyInfo.website ? companyInfo.website : ''}
                            onChange={handleChangeCompanyInfo}
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} paddingX={mobile ? 0: 3}>
                        <InputLabel id="logo-label" sx={{ color: 'primary.main' }}>
                            Company Logo
                        </InputLabel>
                        <Typography fontSize={14} fontWeight={300}>This will appear on quotes, invoices, emails & in the client portal</Typography>
                        <Box marginTop={2}>
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
                            {fileURLs.length === 0 &&
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
                                {fileURLs.length > 0 &&
                                    <Box>
                                    <IconButton onClick={() => handleDelete()}>
                                        <Close />
                                    </IconButton>
                                    <ImageListItem>
                                        <img src={fileURLs?.[0]?.url} alt="company logo" />
                                    </ImageListItem>
                                    </Box>
                            }
                            </Box>
                            {loadingFiles && <LinearProgress />}
                        </Box>
                    </Grid>
                </Grid>
            <Divider sx={{paddingY: 2}} />
            <Typography fontSize={20} fontWeight={600} textAlign="center">Company Address</Typography>
            <form>
            <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}>
            <Grid container paddingX={mobile ? 0 : 5} spacing={2}>
                <Grid item xs={12} sm={6} >
                    <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                            Address
                        </InputLabel>
                        <TextField
                            id="address"
                            autoComplete="street-address"
                            value={
                            companyInfo.address ? companyInfo.address : ''
                            }
                            onChange={handleChangeCompanyInfo}
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
                            companyInfo.address2 ? companyInfo.address2 : ''
                            }
                            onChange={handleChangeCompanyInfo}
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
                            value={companyInfo.city ? companyInfo.city : ''}
                            onChange={handleChangeCompanyInfo}
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
                            companyInfo.state ? companyInfo.state : ''
                            }
                            onChange={handleChangeCompanyInfo}
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
                            value={companyInfo.zip ? companyInfo.zip : ''}
                            onChange={handleChangeCompanyInfo}
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
                            companyInfo.country ? companyInfo.country : ''
                            }
                            onChange={handleChangeCompanyInfo}
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
            </Stack>
            {loading && <LinearProgress sx={{marginTop: 2}} />}
        </CardContent>
        <Box marginY={2} display="flex" justifyContent={'center'}>
            <Button variant="contained" onClick={handleSave}>Continue</Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
      </Card>
    </Grid>
  </Grid>
  );
}

export default GettingStarted;