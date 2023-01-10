import { AddressAutofill } from '@mapbox/search-js-react';
import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import RegexParser from 'regex-parser';
import { createClient } from '../../api/client.api';
import { createProperty } from '../../api/property.api';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

  
export default function NewClient(props: any) {
    const [contact, setContact] = useState({} as any);
    const [property, setProperty] = useState({} as any);
    const [activeStep, setActiveStep] = useState(0);
    const [phones, setPhones] = useState([''] as string[]);
    const [emails, setEmails] = useState([''] as string[]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleCancel = () => {
        props.onClose();
        setContact({});
        setProperty({});
        setPhones(['']);
        setEmails(['']);
      };
  
      const handleSave = () => {
        createClient(buildClient())
        .then(res => {
          if (propValid()) {
            createProperty({client: res.id, ...property})
            .then(propRes => {
              navigate(`/clients/${res.id}`);
            }, (propErr) => {
              setError(propErr.message);
            })
          } else {
            navigate(`/clients/${res.id}`);
          }
        }, (err) => {
          setError(err.message);
        })
      };

      const propValid = () => {
        return Object.keys(property).filter(k => !!property[k]?.trim()).length > 0;
      }

      const buildClient = () => {
        let client = {} as any;
        phones.filter(p => p.trim().length > 5).forEach((phone, index) => {
          let key = 'phone';
          if (index > 0) key = `phone${index+1}`
          client[key] = phone;
        })
        emails.filter(e => emailValid(e)).forEach((email, index) => {
          let key = 'email';
          if (index > 0) key = `email${index+1}`
          client[key] = email;
        })
        return {...client, ...contact};
      }
  
      const handleChange = (event: any) => {
        setContact({ ...contact, [event.target.id]: event.target.value.trim()});
      };

      const handleChangeProperty = (event: any) => {
        setProperty({ ...property, [event.target.id]: event.target.value.trim()});
      };

      const handleChangePhone = (event: any, index: number) => {
        let values = [...phones];
        values[index] = event.target.value;
        setPhones(values);
      }

      const handleRemovePhone = (event: any, index: number) => {
        let values = [...phones];
        setPhones(values.slice(undefined, index).concat(values.slice(index+1, undefined)));
      }

      const handleAddPhone = (event: any) => {
        setPhones([...phones, ''])
      }

      const handleChangeEmail = (event: any, index: number) => {
        let values = [...emails];
        values[index] = event.target.value;
        setEmails(values);
      }

      const handleRemoveEmail = (event: any, index: number) => {
        let values = [...emails];
        setEmails(values.slice(undefined, index).concat(values.slice(index+1, undefined)));
      }

      const handleAddEmail = (event: any) => {
        setEmails([...emails, ''])
      }

      let phoneNumbers: any = []
      let emailAddresses: any = []

      const handleNext = () => {  
        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
      };

      const validInput = () => {
        let validContact = buildClient();
        return (validContact.phone || validContact.email || validContact.name?.trim().length > 2);
      }

      const emailValid = (email: any) => {
        // eslint-disable-next-line
        let validEmail = RegexParser("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.");
        return validEmail.test(email);
      }

      phoneNumbers = phones.map((number, index) => {
        return (
            <TextField
            key={index}
            label="Phone"
            type={"tel"}
            value={number}
            onChange={(e) => handleChangePhone(e, index)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                onClick={(e) => handleRemovePhone(e,index)}
                >Remove
                </Button>
              )
            }} />
        );
      })

      emailAddresses = emails.map((email, index) => {
        return (
            <TextField
            key={index}
            label="Email"
            type={"email"}
            value={email}
            onChange={(e) => handleChangeEmail(e, index)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                onClick={(e) => handleRemoveEmail(e,index)}
                >Remove
                </Button>
              )
            }} />
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
                    <AddressAutofill accessToken={mapboxgl.accessToken}>
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
            </React.Fragment>
        </Box>

        </DialogContent>
        <DialogActions>
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
                disabled={!validInput}
                onClick={handleSave}>
                    Create
                </Button>
                ) : (
                <Button
                onClick={handleNext}
                disabled={!validInput()}
                >
                    Next
                </Button>
                )}
            </Box>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  