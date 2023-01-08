import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';
  
export default function EditContact(props: any) {

    const handleCancel = () => {
        props.onClose();
      };
  
      const handleSave = () => {
        if (props.type === 'edit') props.update();
        if (props.type === 'new') props.create();
      };
  
      const handleChange = (event: any) => {
        props.setContact({ ...props.contact, [event.target.id]: event.target.value.trim()});
      };

      let phoneNumbers: any = []
      let emailAddresses: any = []

      const handleAddPhone = (event: any) => {
        let number = Object.keys(props.contact).filter(k => k.startsWith('phone')).filter(k => !!props.contact[k]).length + 1;
        let id = `phone${number}`;
        let newContact = {...props.contact};
        newContact[id] = " ";
        props.setContact(newContact);
      }

      const handleAddEmail = (event: any) => {
        let number = Object.keys(props.contact).filter(k => k.startsWith('email')).filter(k => !!props.contact[k]).length + 1;
        let id = `email${number}`;
        let newContact = {...props.contact};
        newContact[id] = " ";
        props.setContact(newContact);
      }

      phoneNumbers = Object.keys(props.contact).filter(k => k.startsWith('phone')).filter(k => !!props.contact[k]).map((_, index) => {

        let number = '';
        if (index > 0) number = `${index+1}`;
        let id = `phone${number}`;

        return (
            <TextField 
            id={id}
            key={id}
            label="Phone" 
            type={"tel"}
            defaultValue={props.contact[id] ? props.contact[id]  : undefined}
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

      emailAddresses = Object.keys(props.contact).filter(k => k.startsWith('email')).filter(k => !!props.contact[k]).map((_, index) => {

        let number = '';
        if (index > 0) number = `${index+1}`;
        let id = `email${number}`;

        return (
            <TextField 
            id={id}
            key={id}
            label="Email" 
            type={"email"}
            defaultValue={props.contact[id] ? props.contact[id]  : undefined}
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
        <DialogTitle>Client Info</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="name" 
                label="Name"
                defaultValue={props.contact.name ? props.contact.name : undefined}
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
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }
  