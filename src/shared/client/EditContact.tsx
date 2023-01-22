import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import RegexParser from 'regex-parser';
import { updateClient } from '../../api/client.api';

  
export default function EditContact(props: any) {
  const [error, setError] = useState(null);

    const handleCancel = () => {
      props.onClose();
    };

    const handleSave = () => {
      let contacts = props.contact.contacts.filter((con: any) => con.content.length > 0)
      props.setContact({...props.contact, contacts: contacts});
      console.log(props.contact);
      updateClient(props.contact)
      .then(res => {
        props.update();
        props.success('Successfully updated client');
      }, (err) => {
        setError(err.message)
      })
    };

    const handleChange = (event: any) => {
      props.setContact({ ...props.contact, [event.target.id]: event.target.value.trim()});
    };

    const handleChangePhone = (event: any, index: number) => {
      let contacts = props.contact?.contacts?.filter((c: any) => c.type === 'phone');
      contacts[index].content = event.target.value;
      contacts = contacts.concat(props.contact?.contacts?.filter((c: any) => c.type === 'email'));
      props.setContact({...props.contact, contacts: contacts});
    }

    const handleRemovePhone = (event: any, index: number) => {
      let contacts = props.contact?.contacts?.filter((c: any) => c.type === 'phone');
      contacts = contacts.slice(undefined, index).concat(contacts.slice(index+1, undefined));
      contacts = contacts.concat(props.contact?.contacts?.filter((c: any) => c.type === 'email'));
      props.setContact({...props.contact, contacts: contacts});
    }

    const handleAddPhone = (event: any) => {
      let contacts = props.contact.contacts;
      contacts.push({type: 'phone', content: ''})
      props.setContact({...props.contact, contacts: contacts});
    }

    const handleChangeEmail = (event: any, index: number) => {
      let contacts = props.contact?.contacts?.filter((c: any) => c.type === 'email');
      contacts[index].content = event.target.value;
      contacts = contacts.concat(props.contact?.contacts?.filter((c: any) => c.type === 'phone'));
      props.setContact({...props.contact, contacts: contacts});
    }

    const handleRemoveEmail = (event: any, index: number) => {
      let contacts = props.contact?.contacts?.filter((c: any) => c.type === 'email');
      contacts = contacts.slice(undefined, index).concat(contacts.slice(index+1, undefined));
      contacts = contacts.concat(props.contact?.contacts?.filter((c: any) => c.type === 'phone'));
      props.setContact({...props.contact, contacts: contacts});
    }

    const handleAddEmail = (event: any) => {
      let contacts = props.contact.contacts;
      contacts.push({type: 'email', content: ''})
      props.setContact({...props.contact, contacts: contacts});
    }

    const validInput = () => {
      return ((props.contact.contacts.filter((con: any) => con.content?.length > 4).length > 0 || props.contact.first?.trim().length > 1 || props.contact.last?.trim().length > 1))
       && (props.contact.contacts.filter((email: any) => email.type==='email').filter((email: any) => !emailValid(email.content) && email.content.trim().length > 0).length === 0);
    }

    const emailValid = (email: any) => {
      // eslint-disable-next-line
      let validEmail = RegexParser("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.");
      return validEmail.test(email);
    }

    let phoneNumbers: any = []
    let emailAddresses: any = []

    phoneNumbers = props.contact?.contacts?.filter((c: any) => c.type === 'phone')?.map((phone: any, index: any) => {
      return (
          <TextField
          key={index}
          label="Phone"
          type={"tel"}
          value={phone.content}
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

    emailAddresses = props.contact?.contacts?.filter((c: any) => c.type === 'email')?.map((email: any, index: any) => {
      return (
          <TextField
          key={index}
          label="Email"
          type={"email"}
          value={email.content}
          error={!(emailValid(email.content) || email.content.length < 1)}
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
              <Stack direction={'row'}>
              <TextField
                id="first" 
                label="First name"
                defaultValue={props.contact?.first ? props.contact.first : undefined}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PersonOutline />
                    </InputAdornment>
                    ),
                }}
                />
                <TextField
                id="last" 
                label="Last name"
                defaultValue={props.contact?.last ? props.contact.last : undefined}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PersonOutline />
                    </InputAdornment>
                    ),
                }}
                />
              </Stack>
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
  