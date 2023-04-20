import { AddressAutofill } from '@mapbox/search-js-react';
import {
  AddCircleOutlineOutlined,
  Close,
  DeleteOutline,
  EmailOutlined,
  PersonOutline,
  PhoneOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  useMediaQuery,
} from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../../api/client.api';
import { createProperty } from '../../api/property.api';
import { theme } from '../../theme/theme';
import { emailValid } from '../../util/tools';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

export default function NewClient(props: any) {
  const [contact, setContact] = useState({
    contacts: [
      { type: 'phone', content: '' },
      { type: 'email', content: '' },
    ],
  } as any);
  const [property, setProperty] = useState({} as any);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    props.onClose();
    setContact({
      contacts: [
        { type: 'phone', content: '' },
        { type: 'email', content: '' },
      ],
    });
    setProperty({});
  };

  const handleSave = () => {
    setLoading(true);
    let contacts = contact.contacts?.filter(
      (con: any) => con.content.length > 0
    );
    setContact({ ...contact, contacts: contacts });
    createClient(contact).then(
      (res) => {
        if (propValid()) {
          createProperty({ client: res.id, ...property }).then(
            (propRes) => {
              setLoading(false);
              navigate(`/clients/${res.id}`);
              props.onClose();
              props.success('Client created successfully');
              setContact({
                contacts: [
                  { type: 'phone', content: '' },
                  { type: 'email', content: '' },
                ],
              } as any);
              setActiveStep(0);
            },
            (propErr) => {
              setLoading(false);
              setError(propErr.message);
            }
          );
        } else {
          setLoading(false);
          navigate(`/clients/${res.id}`);
          props.onClose();
          props.success('Client created successfully');
          setContact({
            contacts: [
              { type: 'phone', content: '' },
              { type: 'email', content: '' },
            ],
          } as any);
          setActiveStep(0);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  const propValid = () => {
    return (
      Object.keys(property)?.filter((k) => !!property[k]?.trim()).length > 0
    );
  };

  const handleChange = (event: any) => {
    setContact({ ...contact, [event.target.id]: event.target.value });
  };

  const handleChangeProperty = (event: any) => {
    setProperty({ ...property, [event.target.id]: event.target.value });
  };

  const handleChangePhone = (event: any, index: number) => {
    let contacts = contact?.contacts?.filter((c: any) => c.type === 'phone');
    contacts[index].content = event.target.value;
    contacts = contacts.concat(
      contact?.contacts?.filter((c: any) => c.type === 'email')
    );
    setContact({ ...contact, contacts: contacts });
  };

  const handleRemovePhone = (event: any, index: number) => {
    let contacts = contact?.contacts?.filter((c: any) => c.type === 'phone');
    contacts = contacts
      .slice(undefined, index)
      .concat(contacts.slice(index + 1, undefined));
    contacts = contacts.concat(
      contact?.contacts?.filter((c: any) => c.type === 'email')
    );
    setContact({ ...contact, contacts: contacts });
  };

  const handleAddPhone = (event: any) => {
    let contacts = contact.contacts;
    contacts.push({ type: 'phone', content: '' });
    setContact({ ...contact, contacts: contacts });
  };

  const handleChangeEmail = (event: any, index: number) => {
    let contacts = contact?.contacts?.filter((c: any) => c.type === 'email');
    contacts[index].content = event.target.value;
    contacts = contacts.concat(
      contact?.contacts?.filter((c: any) => c.type === 'phone')
    );
    setContact({ ...contact, contacts: contacts });
  };

  const handleRemoveEmail = (event: any, index: number) => {
    let contacts = contact?.contacts?.filter((c: any) => c.type === 'email');
    contacts = contacts
      .slice(undefined, index)
      .concat(contacts.slice(index + 1, undefined));
    contacts = contacts.concat(
      contact?.contacts?.filter((c: any) => c.type === 'phone')
    );
    setContact({ ...contact, contacts: contacts });
  };

  const handleAddEmail = (event: any) => {
    let contacts = contact.contacts;
    contacts.push({ type: 'email', content: '' });
    setContact({ ...contact, contacts: contacts });
  };

  let phoneNumbers: any = [];
  let emailAddresses: any = [];

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const validInput = () => {
    return (
      (contact.contacts?.filter((con: any) => con.content?.length > 4).length >
        0 ||
        contact.first?.trim().length > 1 ||
        contact.last?.trim().length > 1) &&
      contact.contacts
        ?.filter((email: any) => email.type === 'email')
        ?.filter(
          (email: any) =>
            !emailValid(email.content) && email.content.trim().length > 0
        ).length === 0
    );
  };

  phoneNumbers = contact?.contacts
    ?.filter((c: any) => c.type === 'phone')
    ?.map((phone: any, index: any) => {
      return (
        <Stack key={index}>
        <InputLabel id="phone-label" sx={{ color: 'primary.main' }}>
            Phone
        </InputLabel>
        <TextField
          type={'tel'}
          value={phone.content}
          error={!(phone.content.length > 4 || phone.content.length < 1)}
          onChange={(e) => handleChangePhone(e, index)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneOutlined color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={(e) => handleRemovePhone(e, index)}>
                <DeleteOutline color="error" />
              </IconButton>
            ),
          }}
        />
        </Stack>
      );
    });

  emailAddresses = contact?.contacts
    ?.filter((c: any) => c.type === 'email')
    ?.map((email: any, index: any) => {
      return (
        <Stack key={index}>
          <InputLabel id="email-label" sx={{ color: 'primary.main' }}>
              Email
          </InputLabel>
        <TextField
          type={'email'}
          value={email.content}
          onChange={(e) => handleChangeEmail(e, index)}
          error={!(emailValid(email.content) || email.content.length < 1)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={(e) => handleRemoveEmail(e, index)}>
                <DeleteOutline color="error" />
              </IconButton>
            ),
          }}
        />
        </Stack>
      );
    });

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open}>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
      <DialogTitle align="center">Create new client</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress sx={{marginBottom: 2}} />}
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Client Info</StepLabel>
            </Step>
            <Step>
              <StepLabel>Property Info</StepLabel>
            </Step>
          </Stepper>
          <Box mt={4}>
            {activeStep === 0 ? (
              <Stack spacing={2}>
                <Stack direction={'row'} spacing={2}>
                  <Stack>
                  <InputLabel id="first-label" sx={{ color: 'primary.main' }}>
                      First name
                  </InputLabel>
                  <TextField
                    id="first"
                    value={contact.first ? contact.first : ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  </Stack>
                  <Stack>
                    <InputLabel id="last-label" sx={{ color: 'primary.main' }}>
                        Last name
                    </InputLabel>
                  <TextField
                    id="last"
                    value={contact.last ? contact.last : ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  </Stack>
                </Stack>
                {phoneNumbers}
                <Button
                  sx={{ alignSelf: 'flex-start' }}
                  onClick={handleAddPhone}
                  startIcon={<AddCircleOutlineOutlined />}
                >
                  Add Phone Number
                </Button>
                {emailAddresses}
                <Button
                  sx={{ alignSelf: 'flex-start' }}
                  onClick={handleAddEmail}
                  startIcon={<AddCircleOutlineOutlined />}
                >
                  Add Email Address
                </Button>
              </Stack>
            ) : (
              <form>
                <AddressAutofill accessToken={mapboxgl.accessToken}>
                  <Stack spacing={2}>
                  <Stack>
                    <InputLabel id="address-label" sx={{ color: 'primary.main' }}>
                        Address
                    </InputLabel>
                    <TextField
                      id="address"
                      autoComplete="street-address"
                      value={
                        property.address ? property.address : ''
                      }
                      onChange={handleChangeProperty}
                    />
                    </Stack>
                    <Stack>
                    <InputLabel id="unit-label" sx={{ color: 'primary.main' }}>
                        Unit
                    </InputLabel>
                    <TextField
                      id="address2"
                      value={
                        property.address2 ? property.address2 : ''
                      }
                      onChange={handleChangeProperty}
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
                        value={property.city ? property.city : ''}
                        onChange={handleChangeProperty}
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
                          property.state ? property.state : ''
                        }
                        onChange={handleChangeProperty}
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
                        value={property.zip ? property.zip : ''}
                        onChange={handleChangeProperty}
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
                          property.country ? property.country : ''
                        }
                        onChange={handleChangeProperty}
                      />
                      </Stack>
                    </Stack>
                  </Stack>
                </AddressAutofill>
              </form>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        {activeStep === 1 ? (
          <Button
            disabled={!validInput}
            onClick={handleSave}
            variant="contained"
          >
            Create
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!validInput()}
            variant="contained"
          >
            Next
          </Button>
        )}
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
