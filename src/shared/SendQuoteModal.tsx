import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Tab, Tabs, TextField, Typography, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { getClient } from '../api/client.api';
import { sendQuote } from '../api/email.api';
import { sendSMS } from '../api/sms.api';
import { currentUser } from '../auth/firebase';
import { theme } from '../theme/theme';
import { emailValid } from '../util/tools';

export default function SendQuoteModal(props: any) {
    const [value, setValue] = useState(0);
    const [smsMessage, setSMSMessage] = useState({toList: [], to: '', body: ''} as any);
    const [emailMessage, setEmailMessage] = useState({toList: [], to: '', subject: '', replyToQuoteEmail: '', body: ''} as any);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailsInvalid, setEmailsInvalid] = useState(false);

    function addVariables(text: string, client: any) {
        return text
        .replace('{{{client_first}}}', client.first)
        .replace('{{{client_last}}}', client.last)
        .replace('{{{total}}}', props.quote.quote.price)
    }

    const handleCancel = () => {
        props.onClose();
      };

    const handleSend = () => {
        setLoading(true);
        if (value === 0) {
            if (!emailMessage.to || emailMessage.to?.trim() === '' || emailValid(emailMessage.to)) {
                // send email
                let emailList = emailMessage.toList;
                if (emailMessage.to && emailMessage.to?.trim() !== '') emailList.push(emailMessage.to);
                let email = {
                    emails: emailList,
                    replyTo: emailMessage.replyToQuoteEmail,
                    subject: emailMessage.subject,
                    body: emailMessage.body,
                    quote: props.quote.quote.id,
                    client: props.quote.quote.client,
                }
                sendQuote(email)
                .then(res => {
                    setLoading(false);
                    props.success('Sent email successfully');
                }, err => {
                    setLoading(false);
                    setError(err.message);
                })
            } else {
                setLoading(false);
                setEmailsInvalid(true);
            }
        }
        if (value === 1) {
            // send sms
            let smsList = smsMessage.toList;
            if (smsMessage.to && smsMessage.to?.trim() !== '') smsList.push(smsMessage.to);
            let sms = {
                numbers: smsList,
                body: smsMessage.body,
                quote: props.quote.quote.id,
                client: props.quote.quote.client,
            }
            sendSMS(sms)
            .then(res => {
                setLoading(false);
                props.success('Sent SMS successfully');
            }, err => {
                setLoading(false);
                setError(err.message);
            })
        }
      };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleEmailChange = (event: any) => {
        setEmailsInvalid(false);
        setEmailMessage({ ...emailMessage, [event.target.id]: event.target.value});
    }

    const handleSMSChange = (event: any) => {
        setSMSMessage({ ...smsMessage, [event.target.id]: event.target.value});
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

    const handleSMSDelete = (number: string) => {
        let itemIndex = smsMessage.toList.indexOf(number);
        let toList = smsMessage.toList.slice(undefined, itemIndex).concat(smsMessage.toList.slice(itemIndex+1, undefined));
        setSMSMessage({ ...smsMessage, toList});
    }

    const handleSMSKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            let toList = smsMessage.toList;

            toList.push(event.target.value);
            setSMSMessage({ ...smsMessage, toList, to: ''});
        }
    }

    useEffect(() => {
        let replyToQuoteEmail = props.settings?.replyToQuoteEmailEmail ? props.settings?.replyToQuoteEmailEmail : currentUser.email;
        let emailSubject = props.settings?.sendQuoteEmailSubject ? props.settings?.sendQuoteEmailSubject : '';
        let emailBody = props.settings?.sendQuoteEmailBody ? props.settings?.sendQuoteEmailBody : ``;
        let smsBody = props.settings?.sendQuoteSMSBody ? props.settings?.sendQuoteSMSBody : ``;
        getClient(props.quote.quote.client)
        .then(client => {
            let phones = client?.contacts?.filter((contact: any) => contact.type === 'phone')?.filter((contact: any) => contact.content !== '').map((phone: any) => phone.content);
            let emails = client?.contacts?.filter((contact: any) => contact.type === 'email')?.filter((contact: any) => contact.content !== '')?.map((email: any) => email.content);
            setEmailMessage({...emailMessage, replyToQuoteEmail: replyToQuoteEmail, subject: emailSubject, body: addVariables(emailBody, client), toList: emails})
            setSMSMessage({...smsMessage, body: addVariables(smsBody, client), toList: phones})
        }, err => {
            setError(err.message);
        })
        // eslint-disable-next-line
    }, [])
    
    return (
        <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">Send Quote</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <Tabs value={value} onChange={handleChangeTab}  sx={{ mb: 2 }}>
                <Tab label="Email" id="email" />
                <Tab label="SMS" id="sms" />
            </Tabs>
            {value === 0 && 
            <Box>
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
                id="replyToQuoteEmail"
                value={emailMessage.replyToQuoteEmail}
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
            </Box>
            }
            {value === 1 && 
            <Box>
                <Stack spacing={2}>
                <Typography variant="body2" color="primary">To</Typography>
                <TextField
                id="to" 
                value={smsMessage.to}
                onChange={handleSMSChange}
                onKeyDown={handleSMSKeyDown}
                InputProps={{
                    startAdornment: (
                    <>
                    {smsMessage.toList.map((to: string, index: number) => (
                        <Chip
                        onDelete={() => handleSMSDelete(to)}
                        sx={{backgroundColor: "blue.main", color: "blue.dark"}}
                        key={index}
                        label={to}/>
                    ))}
                    </>
                    ),
                }}
                />
                <Typography variant="body2" color="primary">Text Message</Typography>
                <TextField
                id='body'
                multiline
                minRows={3}
                value={smsMessage.body}
                onChange={handleSMSChange}
                />
                </Stack>
            </Box>
            }
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSend}>Send</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }