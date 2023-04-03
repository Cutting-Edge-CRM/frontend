import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  LinearProgress,
  Stack,
  TextField,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { createProperty, updateProperty } from '../../api/property.api';
import { useState } from 'react';
import { theme } from '../../theme/theme';

export default function EditProperty(props: any) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    props.onClose();
  };
  const handleSave = () => {
    setLoading(true);
    if (props.modalType === 'edit') {
      // save value
      updateProperty({ ...props.property, client: props.client }).then(
        (res) => {
          setLoading(false);
          props.update(res);
          props.success('Successfully updated property');
          props.setReload(!props.reload);
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
    if (props.modalType === 'new') {
      // save value
      createProperty({ ...props.property, client: props.client }).then(
        (res) => {
          console.log('created');
          setLoading(false);
          props.create(res);
          props.success('Successfully created property');
          props.setReload(!props.reload);
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
  };

  const handleChange = (event: any) => {
    props.setProperty({
      ...props.property,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}  onClose={handleCancel} open={props.open}>
      <DialogTitle align="center">
        {props.modalType === 'edit' ? 'Edit Property' : 'Create New Property'}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Stack mt={2} >
          <form>
              <AddressAutofill accessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}>
                <Stack spacing={2}>
                  <Stack>
                  <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                    Address
                  </InputLabel>
                  <TextField
                    id="address"
                    autoComplete="street-address"
                    value={
                      props.property.address ? props.property.address : ''
                    }
                    onChange={handleChange}
                  />
                  </Stack>
                  <Stack>
                  <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                    Unit
                  </InputLabel>
                  <TextField
                    id="address2"
                    value={
                      props.property.address2 ? props.property.address2 : ''
                    }
                    onChange={handleChange}
                  />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                    <InputLabel id="city-label" sx={{ color: 'primary.main' }}>
                      City
                    </InputLabel>
                    <TextField
                      id="city"
                      autoComplete="address-level2"
                      value={props.property.city ? props.property.city : ''}
                      onChange={handleChange}
                    />
                    </Stack>
                    <Stack>
                    <InputLabel id="state-label" sx={{ color: 'primary.main' }}>
                      State
                    </InputLabel>
                    <TextField
                      id="state"
                      autoComplete="address-level1"
                      value={
                        props.property.state ? props.property.state : ''
                      }
                      onChange={handleChange}
                    />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Stack>
                    <InputLabel id="postal-label" sx={{ color: 'primary.main' }}>
                      Postal
                    </InputLabel>
                    <TextField
                      id="zip"
                      autoComplete="postal-code"
                      value={props.property.zip ? props.property.zip : ''}
                      onChange={handleChange}
                    />
                    </Stack>
                    <Stack>
                    <InputLabel id="country-label" sx={{ color: 'primary.main' }}>
                      Country
                    </InputLabel>
                    <TextField
                      id="country"
                      autoComplete="country-name"
                      value={
                        props.property.country ? props.property.country : ''
                      }
                      onChange={handleChange}
                    />
                    </Stack>
                  </Stack>
                </Stack>
              </AddressAutofill>
            </form>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
