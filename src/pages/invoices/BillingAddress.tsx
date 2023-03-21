import { Close, Place } from '@mui/icons-material';
import {
    Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { updateInvoice } from '../../api/invoice.api';
import { theme } from '../../theme/theme';
import { AddressAutofill } from '@mapbox/search-js-react';


export default function BillingAddress(props: any) {

  const handleCancel = () => {
    props.onClose();
  };

  const handleChange = (event: any) => {
    let updatedInvoice = props.invoice.invoice;
    updatedInvoice[event.target.id] = event.target.value;
    props.setInvoice({
      ...props.invoice,
      invoice: updatedInvoice,
    });
    };

    const handleSave = () => {
        props.setLoading(true);
        updateInvoice(props.invoice).then(
          (res) => {
            props.setLoading(false);
            props.success('Successfully updated invoice');
            props.onClose();
          },
          (err) => {
            props.setLoading(false);
            props.setError(err.message);
            props.onClose();
          }
        );
    }

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
            <Close fontSize='large'/>
        </IconButton>
        <DialogTitle align="center">Billing Address</DialogTitle>
        <DialogContent>
        <Grid container>
          <Grid item xs={12}>
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
                            props.invoice.invoice.address ? props.invoice.invoice.address : ''
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
                            props.invoice.invoice.address2 ? props.invoice.invoice.address2 : ''
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
                            value={props.invoice.invoice.city ? props.invoice.invoice.city : ''}
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
                            props.invoice.invoice.state ? props.invoice.invoice.state : ''
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
                            value={props.invoice.invoice.zip ? props.invoice.invoice.zip : ''}
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
                            props.invoice.invoice.country ? props.invoice.invoice.country : ''
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{mt: 3}}>
              <Button variant='outlined' onClick={handleCancel}>Cancel</Button>
              <Button variant='contained' onClick={handleSave}>Save</Button>
        </DialogActions>
    </Dialog>
  );
}