import { CreateOutlined } from '@mui/icons-material';
import { Avatar, Card, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import EditContact from './EditContact';


function Contact() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (value: string) => {
      setOpen(false);
      setSelectedValue(value);
    };

    return (
        <Card>
            <Stack direction="row">
                <Avatar>JH</Avatar>
                <Typography>Jim Halpert</Typography>
                <IconButton onClick={handleClickOpen}>
                    <CreateOutlined />
                </IconButton>
                <EditContact
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Typography>Phone</Typography>
                    <Typography>3068508556</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography>Email</Typography>
                    <Typography>jimmyh@gmail.com</Typography>
                </Stack>
            </Stack>
        </Card>
    )
}

export default Contact;