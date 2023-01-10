import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import RegexParser from 'regex-parser';
import { updateClient } from '../../api/client.api';

  
export default function EditContact(props: any) {

  const [contact, setContact] = useState({...props.contact});
  const [error, setError] = useState(null);

    const handleCancel = () => {
      props.onClose();
      setContact({...props.contact});
    };

    const handleSave = () => {
      updateClient(buildClient())
      .then(res => {
        props.update();
      }, (err) => {
        setError(err.message)
      })
    };

    const handleChange = (event: any) => {
      setContact({ ...contact, [event.target.id]: event.target.value.trim()});
    };

    const handleChangePhone = (event: any, index: number) => {
      let values = [...props.phones];
      values[index] = event.target.value;
      props.setPhones(values);
    }

    const handleRemovePhone = (event: any, index: number) => {
      let values = [...props.phones];
      props.setPhones(values.slice(undefined, index).concat(values.slice(index+1, undefined)));
    }

    const handleAddPhone = (event: any) => {
      props.setPhones([...props.phones, ''])
    }

    const handleChangeEmail = (event: any, index: number) => {
      let values = [...props.emails];
      values[index] = event.target.value;
      props.setEmails(values);
    }

    const handleRemoveEmail = (event: any, index: number) => {
      let values = [...props.emails];
      props.setEmails(values.slice(undefined, index).concat(values.slice(index+1, undefined)));
    }

    const handleAddEmail = (event: any) => {
      props.setEmails([...props.emails, ''])
    }

    const validInput = () => {
      let validContact = buildClient();
      return (validContact.phone || validContact.email || validContact.name?.trim().length > 2);
    }

    const emailValid = (email: any) => {
      // eslint-disable-next-line
      let validEmail = RegexParser("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.");
      return validEmail.test(email);
    }

    const buildClient = () => {
      let client = {} as any;
      props.phones?.filter((p: any) => p.trim().length > 5).forEach((phone: any, index: any) => {
        let key = 'phone';
        if (index > 0) key = `phone${index+1}`
        client[key] = phone;
      })
      props.emails?.filter((e: any) => emailValid(e)).forEach((email: any, index: any) => {
        let key = 'email';
        if (index > 0) key = `email${index+1}`
        client[key] = email;
      })
      return {...client, name: contact.name, id: contact.id, company: contact.company};
    }

    let phoneNumbers: any = []
    let emailAddresses: any = []

    phoneNumbers = props.phones?.map((number: any, index: any) => {
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

    emailAddresses = props.emails?.map((email: any, index: any) => {
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
        <DialogTitle>Client Info</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button disabled={!validInput()} onClick={handleSave}>Save Changes</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  