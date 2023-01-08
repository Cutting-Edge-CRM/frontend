import { CreateOutlined } from '@mui/icons-material';
import { Avatar, Card, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getClient } from '../api/client.api';
import EditContact from './EditContact';


function Contact(props: any) {
    const [open, setOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [contact, setContact] = useState({} as any);

    const handleEditOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };

    const handleUpdate = (value: string) => {
        setOpen(false);
        // save value
    };

    useEffect(() => {
        getClient(props.client)
        .then((result) => {
          setIsLoaded(true);
          setContact(result);
        }, (err) => {
          setIsLoaded(true);
          setError(err.message)
        })
      }, [props])

    if (error) {
    return (<Typography>{error}</Typography>);
    }
    if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
    }

    return (
        <Card>
            <Stack direction="row">
                <Avatar>{(contact?.name as string)?.split(" ")?.map(p => p[0])?.join('')?.toUpperCase()}</Avatar>
                <Typography>{contact?.name}</Typography>
                <IconButton onClick={handleEditOpen}>
                    <CreateOutlined />
                </IconButton>
                <EditContact
                    contact={contact}
                    setContact={setContact}
                    open={open}
                    onClose={handleClose}
                    update={handleUpdate}
                    type={'edit'}
                />
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Typography>Phone</Typography>
                    <Typography>{contact?.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography>Email</Typography>
                    <Typography>{contact?.email}</Typography>
                </Stack>
            </Stack>
        </Card>
    )
}

export default Contact;