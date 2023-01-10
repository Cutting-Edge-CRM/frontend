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
    const [phones, setPhones] = useState([] as string[]);
    const [emails, setEmails] = useState([] as string[]);

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
          setPhones(Object.keys(result).filter((k: any) => k.startsWith('phone')).filter((k: any) => !!result[k]).map((k: any) => result[k]));
          setEmails(Object.keys(result).filter((k: any) => k.startsWith('email')).filter((k: any) => !!result[k]).map((k: any) => result[k]));
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
                <Avatar>{(contact?.name as string)?.split(" ")?.map(p => p[0])?.join('')?.toUpperCase()}</Avatar>
                <Typography>{contact?.name}</Typography>
                <IconButton onClick={handleEditOpen}>
                    <CreateOutlined />
                </IconButton>
                <EditContact
                    contact={contact}
                    setContact={setContact}
                    phones={phones}
                    setPhones={setPhones}
                    emails={emails}
                    setEmails={setEmails}
                    open={open}
                    onClose={handleClose}
                    update={handleUpdate}
                    type={'edit'}
                />
            </Stack>
            <Stack spacing={2}>
            {phones.map((phone: any, index) => (
                <Stack direction="row" spacing={2} key={index}>
                    <Typography>Phone</Typography>
                    <Typography>{phone}</Typography>
                </Stack>
                ))}
            {emails.map((email: any, index) => (
                <Stack direction="row" spacing={2} key={index}>
                    <Typography>Email</Typography>
                    <Typography>{email}</Typography>
                </Stack>
                ))}
            </Stack>
        </Card>
    )
}

export default Contact;