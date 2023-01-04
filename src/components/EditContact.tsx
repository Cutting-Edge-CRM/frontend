import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';

export interface EditContactProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
export default function EditContact(props: EditContactProps) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Client Info</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="name" 
                label="Name"
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PersonOutline />
                    </InputAdornment>
                    ),
                }}
                />
                <TextField 
                id="phone" 
                label="Phone" 
                type={"tel"}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PhoneOutlined />
                    </InputAdornment>
                    ),
                }}
                />
                <Button startIcon={<AddCircleOutlineOutlined />}>Add Phone Number</Button>
                <TextField 
                id="email" 
                label="Email"
                type={"email"}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <EmailOutlined />
                    </InputAdornment>
                    ),
                }}
                />
                <Button startIcon={<AddCircleOutlineOutlined />}>Add Email Address</Button>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }
  