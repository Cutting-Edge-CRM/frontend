import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getClient } from '../api/client.api';
import { sendReceipt } from '../api/email.api';
import { currentUser } from '../auth/firebase';
import { theme } from '../theme/theme';
import { emailValid } from '../util/tools';

export default function SendReceiptModal(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailsInvalid, setEmailsInvalid] = useState(false);
    const [emailMessage, setEmailMessage] = useState({toList: [], to: '', subject: '', replyToReceiptEmail: '', body: ''} as any);


    function addVariables(text: string, client: any) {
        return text
        .replace('{{{client_first}}}', client.first)
        .replace('{{{client_last}}}', client.last)
        .replace('{{{total}}}', props.payment.amount)
    }

    const handleSend = () => {
        setLoading(true);
        if (!emailMessage.to || emailMessage.to?.trim() === '' || emailValid(emailMessage.to)) {
            // send email
            let emailList = emailMessage.toList;
            if (emailMessage.to && emailMessage.to?.trim() !== '') emailList.push(emailMessage.to);
            let email = {
                emails: emailList,
                replyTo: emailMessage.replyToReceiptEmail,
                subject: emailMessage.subject,
                body: emailMessage.body,
                payment: props.payment.id,
                client: props.payment.client,
            }
            sendReceipt(email)
            .then(res => {
                setLoading(false);
                props.success('Sent receipt successfully');
            }, err => {
                setLoading(false);
                setError(err.message);
            })
        } else {
            setLoading(false);
            setEmailsInvalid(true);
        }
    }

    const handleEmailChange = (event: any) => {
        setEmailsInvalid(false);
        setEmailMessage({ ...emailMessage, [event.target.id]: event.target.value?.trim()});
    }

    const handleEmailDelete = (email: string) => {
        let itemIndex = emailMessage.toList.indexOf(email);
        let toList = emailMessage.toList.slice(undefined, itemIndex).concat(emailMessage.toList.slice(itemIndex+1, undefined));
        setEmailMessage({ ...emailMessage, toList});
    }

    const handleEmailKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            if (emailValid(event.target.value)) {
                let toList = emailMessage.toList;
                toList.push(event.target.value);
                setEmailMessage({ ...emailMessage, toList, to: ''});
            } else {
                setEmailsInvalid(true);
            }
        }
    }

    useEffect(() => {
        let replyToReceiptEmail = props.settings?.replyToReceiptEmail ? props.settings?.replyToReceiptEmail : currentUser.email;
        let emailSubject = props.settings?.sendReceiptEmailSubject ? props.settings?.sendReceiptEmailSubject : '';
        let emailBody = props.settings?.sendReceiptEmailBody ? props.settings?.sendReceiptEmailBody : ``;
        getClient(props.payment.client)
        .then(client => {
            let emails = client?.contacts?.filter((contact: any) => contact.type === 'email')?.map((email: any) => email.content);
            setEmailMessage({...emailMessage, replyToReceiptEmail: replyToReceiptEmail, subject: emailSubject, body: addVariables(emailBody, client), toList: emails})
        }, err => {
            setError(err.message);
        })
        // eslint-disable-next-line
    }, [])


    const handleCancel = () => {
        props.onClose();
      };

    return (
        <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">Send Receipt</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <Stack spacing={2}>
                <Typography variant="body2" color="primary">To</Typography>
                <TextField
                id="to" 
                error={emailsInvalid}
                value={emailMessage.to}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}
                InputProps={{
                    startAdornment: (
                    <>
                    {emailMessage.toList.map((to: string, index: number) => (
                        <Chip
                        sx={{backgroundColor: "blue.main", color: "blue.dark"}}
                        onDelete={() => handleEmailDelete(to)}
                        key={index}
                        label={to}/>
                    ))}
                    </>
                    ),
                }}
                />
                <Typography variant="body2" color="primary">Reply To</Typography>
                <TextField
                id="replyToReceiptEmail"
                value={emailMessage.replyToReceiptEmail}
                onChange={handleEmailChange}
                />
                <Typography variant="body2" color="primary">Email Subject</Typography>
                <TextField
                id="subject" 
                value={emailMessage.subject}
                onChange={handleEmailChange}
                />
                <Typography variant="body2" color="primary">Email Body</Typography>
                <TextField
                id='body'
                multiline
                minRows={3}
                value={emailMessage.body}
                onChange={handleEmailChange}
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSend}>Send</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }