import { CreateOutlined } from '@mui/icons-material';
import { Avatar, Card, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getClient } from '../../api/client.api';
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
      }, [props, open])

    if (error) {
    return (<Typography>{error}</Typography>);
    }
    if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
    }

    return (
        <Card>
            <Stack direction="row">
                <Avatar>{contact?.first?.[0]}{contact?.last?.[0]}</Avatar>
                <Typography>{contact?.first} {contact?.last}</Typography>
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
                    success={props.success}
                />
            </Stack>
            <Stack spacing={2}>
            {contact?.contacts?.filter((c: any) => c.type === 'phone' && c.content !== '').map((phone: any, index: number) => (
                <Stack direction="row" spacing={2} key={index}>
                    <Typography>Phone</Typography>
                    <Typography>{phone.content}</Typography>
                </Stack>
                ))}
            {contact?.contacts?.filter((c: any) => c.type === 'phone' && c.content !== '').length === 0 && (
                <Stack direction="row" spacing={2}>
                    <Typography>Phone</Typography>
                    <Typography>No phone numbers</Typography>
                </Stack>
                )}
            {contact?.contacts?.filter((c: any) => c.type === 'email' && c.content !== '').map((email: any, index: number) => (
                <Stack direction="row" spacing={2} key={index}>
                    <Typography>Email</Typography>
                    <Typography>{email.content}</Typography>
                </Stack>
                ))}
            {contact?.contacts?.filter((c: any) => c.type === 'email' && c.content !== '').length === 0 && (
                <Stack direction="row" spacing={2}>
                    <Typography>Email</Typography>
                    <Typography>No email addresses</Typography>
                </Stack>
                )}
            </Stack>
        </Card>
    )
}

export default Contact;