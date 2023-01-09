import { AddressAutofill } from '@mapbox/search-js-react';
import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
  
export default function NewClient(props: any) {
    const [contact, setContact] = useState({phone: " ", email: " "} as any);
    const [property, setProperty] = useState({} as any);
    const [activeStep, setActiveStep] = useState(0);

    const handleCancel = () => {
        props.onClose();
      };
  
      const handleSave = () => {
        props.create();
      };
  
      const handleChange = (event: any) => {
        setContact({ ...contact, [event.target.id]: event.target.value.trim()});
      };

      const handleChangeProperty = (event: any) => {
        setProperty({ ...property, [event.target.id]: event.target.value.trim()});
      };

      let phoneNumbers: any = []
      let emailAddresses: any = []

      const handleAddPhone = (event: any) => {
        let number = Object.keys(contact).filter(k => k.startsWith('phone')).filter(k => !!contact[k]).length + 1;
        let id = `phone${number}`;
        let newContact = {...contact};
        newContact[id] = " ";
        setContact(newContact);
      }

      const handleAddEmail = (event: any) => {
        let number = Object.keys(contact).filter(k => k.startsWith('email')).filter(k => !!contact[k]).length + 1;
        let id = `email${number}`;
        let newContact = {...contact};
        newContact[id] = " ";
        setContact(newContact);
      }

      const handleNext = () => {  
        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
      };

      phoneNumbers = Object.keys(contact).filter(k => k.startsWith('phone')).filter(k => !!contact[k]).map((_, index) => {

        let number = '';
        if (index > 0) number = `${index+1}`;
        let id = `phone${number}`;

        return (
            <TextField 
            id={id}
            key={id}
            label="Phone" 
            type={"tel"}
            defaultValue={contact[id] ? contact[id]  : undefined}
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <PhoneOutlined />
                </InputAdornment>
                ),
            }}
            />
        );
      })

      emailAddresses = Object.keys(contact).filter(k => k.startsWith('email')).filter(k => !!contact[k]).map((_, index) => {

        let number = '';
        if (index > 0) number = `${index+1}`;
        let id = `email${number}`;

        return (
            <TextField 
            id={id}
            key={id}
            label="Email" 
            type={"email"}
            defaultValue={contact[id] ? contact[id]  : undefined}
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <EmailOutlined />
                </InputAdornment>
                ),
            }}
            />
        );
      })

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Create new client</DialogTitle>
        <DialogContent>
        <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
            <Step>
                <StepLabel>Client Info</StepLabel>
            </Step>
            <Step>
                <StepLabel>Property Info</StepLabel>
            </Step>
        </Stepper>
            <React.Fragment>
                {activeStep === 0 ? (
                <Stack spacing={2}>
                    <TextField
                    id="name" 
                    label="Name"
                    defaultValue={contact.name ? contact.name : undefined}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    />
                    {phoneNumbers}
                    <Button onClick={handleAddPhone} startIcon={<AddCircleOutlineOutlined />}>Add Phone Number</Button>
                    {emailAddresses}
                    <Button onClick={handleAddEmail} startIcon={<AddCircleOutlineOutlined />}>Add Email Address</Button>
                </Stack>
                ) : (
                    <form>
                    <AddressAutofill accessToken={props.token}>
                      <Stack spacing={2}>
                          <TextField
                          id="address" 
                          label="Address"
                          autoComplete='street-address'
                          defaultValue={property.address ? property.address : undefined}
                          onChange={handleChangeProperty}
                          />
                          <TextField
                          id="address2" 
                          label="Unit"
                          defaultValue={property.address2 ? property.address2 : undefined}
                          onChange={handleChangeProperty}
                          />
                          <Stack direction='row'>
                            <TextField
                            id="city" 
                            label="City"
                            autoComplete='address-level2'
                            defaultValue={property.city ? property.city : undefined}
                            onChange={handleChangeProperty}
                            />
                            <TextField
                            id="state" 
                            label="State/Province"
                            autoComplete='address-level1'
                            defaultValue={property.state ? property.state : undefined}
                            onChange={handleChangeProperty}
                            />
                          </Stack>
                          <Stack direction='row'>
                            <TextField
                            id="zip" 
                            label="Postal"
                            autoComplete='postal-code'
                            defaultValue={property.zip ? property.zip : undefined}
                            onChange={handleChangeProperty}
                            />
                            <TextField
                            id="country" 
                            label="Country"
                            autoComplete='country-name'
                            defaultValue={property.country ? property.country : undefined}
                            onChange={handleChangeProperty}
                            />
                          </Stack>
                      </Stack>
                    </AddressAutofill>
                    </form>
                )}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === 1 ? (
                <Button
                onClick={handleSave}>
                    Create
                </Button>
                ) : (
                <Button
                onClick={handleNext}
                disabled={false}>
                    Next
                </Button>
                )}
            </Box>
            </React.Fragment>
        </Box>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }
  