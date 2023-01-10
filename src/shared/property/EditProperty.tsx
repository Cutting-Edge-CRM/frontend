import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { createProperty, updateProperty } from '../../api/property.api';
import { useState } from 'react';

export default function EditProperty(props: any) {
  const [error, setError] = useState(null);
  
    const handleCancel = () => {
      props.onClose();
    };
    const handleSave = () => {
      if (props.modalType === 'edit') {
        // save value
        updateProperty({...props.property, client: props.client})
        .then(res => {
            props.update(res);
        }, (err) => {
          setError(err.message)
        })
      }
      if (props.modalType === 'new') {
          // save value
          createProperty({...props.property, client: props.client})
          .then(res => {
              props.create(res);
          }, (err) => {
            setError(err.message)
          })
      }
    };

    const handleChange = (event: any) => {
      props.setProperty({ ...props.property, [event.target.id]: event.target.value});
    };

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>{props.modalType === 'edit' ? "Edit Property" : "Create New Property"}</DialogTitle>
        <DialogContent>
          <form>
          <AddressAutofill accessToken={props.token}>
            <Stack spacing={2}>
                <TextField
                id="address" 
                label="Address"
                autoComplete='street-address'
                defaultValue={props.property.address ? props.property.address : undefined}
                onChange={handleChange}
                />
                <TextField
                id="address2" 
                label="Unit"
                defaultValue={props.property.address2 ? props.property.address2 : undefined}
                onChange={handleChange}
                />
                <Stack direction='row'>
                  <TextField
                  id="city" 
                  label="City"
                  autoComplete='address-level2'
                  defaultValue={props.property.city ? props.property.city : undefined}
                  onChange={handleChange}
                  />
                  <TextField
                  id="state" 
                  label="State/Province"
                  autoComplete='address-level1'
                  defaultValue={props.property.state ? props.property.state : undefined}
                  onChange={handleChange}
                  />
                </Stack>
                <Stack direction='row'>
                  <TextField
                  id="zip" 
                  label="Postal"
                  autoComplete='postal-code'
                  defaultValue={props.property.zip ? props.property.zip : undefined}
                  onChange={handleChange}
                  />
                  <TextField
                  id="country" 
                  label="Country"
                  autoComplete='country-name'
                  defaultValue={props.property.country ? props.property.country : undefined}
                  onChange={handleChange}
                  />
                </Stack>
            </Stack>
          </AddressAutofill>
          </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }