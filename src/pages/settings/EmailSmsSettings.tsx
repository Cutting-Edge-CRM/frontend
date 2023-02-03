import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, InputLabel, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { updateSettings } from '../../api/settings.api';


function EmailSmsSettings(props: any) {
    const [error, setError] = useState(null);

    const handleChange = (event: any) => {
        props.setSettings({ ...props.settings, [event.target.id]: event.target.value });
      };

    const handleSave = () => {
        updateSettings(props.settings)
        .then(res => {
            props.success('Successfully updated settings');   
        }, err => {
            setError(err);
        })
    }

    const handleReload = () => {
        window.location.reload();
    }

    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
            <Accordion sx={{ py: 3, px: 2, position: 'static' }}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography
            color={'primary'}
            variant='h6'
            >Quote Email Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={'row'}>
                    <Typography
                    width="50%"
                    variant="body2"
                    color="neutral.dark"
                    >Update how your email will look to clients when sending a quote via email.</Typography>
                    <Stack spacing={2} width="50%">
                        <InputLabel id="quote-email-subject-label" sx={{ color: 'primary.main' }}>
                            Email Subject
                        </InputLabel>
                        <TextField
                            id="sendQuoteEmailSubject"
                            value={
                            props.settings.sendQuoteEmailSubject ? props.settings.sendQuoteEmailSubject : `Quote for painting`
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="quote-email-replyTo-label" sx={{ color: 'primary.main' }}>
                            Reply To
                        </InputLabel>
                        <TextField
                            id="replyToQuoteEmail"
                            value={
                            props.settings.replyToQuoteEmail ? props.settings.replyToQuoteEmail : ''
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="quote-email-body-label" sx={{ color: 'primary.main' }}>
                            Email Body
                        </InputLabel>
                        <TextField
                            id="sendQuoteEmailBody"
                            multiline
                            minRows={5}
                            value={
                            props.settings.sendQuoteEmailBody ? props.settings.sendQuoteEmailBody : `Hello,\n\nThank you for asking us to quote your painting project. You can access your quote by visiting the link below. Don't hesitate to let us know if you have any questions or concerns, and we look forward to working with you!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
        <Accordion sx={{ py: 3, px: 2, position: 'static'  }}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography
            color={'primary'}
            variant='h6'
            >Invoice Email Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={'row'}>
                    <Typography
                    width="50%"
                    variant="body2"
                    color="neutral.dark"
                    >Update how your email will look to clients when sending an invoice via email.</Typography>
                    <Stack spacing={2} width="50%">
                        <InputLabel id="quote-email-subject-label" sx={{ color: 'primary.main' }}>
                            Email Subject
                        </InputLabel>
                        <TextField
                            id="sendInvoiceEmailSubject"
                            value={
                            props.settings.sendInvoiceEmailSubject ? props.settings.sendInvoiceEmailSubject : `Invoice for painting`
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="invoice-email-replyTo-label" sx={{ color: 'primary.main' }}>
                            Reply To
                        </InputLabel>
                        <TextField
                            id="replyToInvoiceEmail"
                            value={
                            props.settings.replyToInvoiceEmail ? props.settings.replyToInvoiceEmail : ''
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="invoice-email-body-label" sx={{ color: 'primary.main' }}>
                            Email Body
                        </InputLabel>
                        <TextField
                            id="sendInvoiceEmailBody"
                            multiline
                            minRows={5}
                            value={
                            props.settings.sendInvoiceEmailBody ? props.settings.sendInvoiceEmailBody : `Hello,\n\nThank you for your business. You can access your invoice by visiting the link below. Don't hesitate to let us know if you have any questions or concerns regarding this invoice, and let us know if there's anything you need in the future!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
        <Accordion sx={{ py: 3, px: 2, position: 'static'  }}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography
            color={'primary'}
            variant='h6'
            >Quote SMS Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={'row'}>
                    <Typography
                    width="50%"
                    variant="body2"
                    color="neutral.dark"
                    >Update how your message will look to clients when sending a quote via text message.</Typography>
                    <Stack spacing={2} width="50%">
                        <InputLabel id="quote-sms-body-label" sx={{ color: 'primary.main' }}>
                            Text Message
                        </InputLabel>
                        <TextField
                            id="sendQuoteSMSBody"
                            multiline
                            minRows={5}
                            value={
                            props.settings.sendQuoteSMSBody ? props.settings.sendQuoteSMSBody : `Hello,\n\nThank you for asking us to quote your painting project. You can access your quote by visiting the link below. Don't hesitate to let us know if you have any questions or concerns, and we look forward to working with you!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
        <Accordion sx={{ py: 3, px: 2, position: 'static'  }}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography
            color={'primary'}
            variant='h6'
            >Invoice SMS Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={'row'}>
                    <Typography
                    width="50%"
                    variant="body2"
                    color="neutral.dark"
                    >Update how your message will look to clients when sending an invoice via text message.</Typography>
                    <Stack spacing={2} width="50%">
                        <InputLabel id="invoice-sms-body-label" sx={{ color: 'primary.main' }}>
                            Text Message
                        </InputLabel>
                        <TextField
                            id="sendInvoiceSMSBody"
                            multiline
                            minRows={5}
                            value={
                            props.settings.sendInvoiceSMSBody ? props.settings.sendInvoiceSMSBody : `Hello,\n\nThank you for your business. You can access your invoice by visiting the link below. Don't hesitate to let us know if you have any questions or concerns regarding this invoice, and let us know if there's anything you need in the future!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={handleReload}>Cancel</Button>
                            <Button variant="contained"  onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
        </>
    )
}

export default EmailSmsSettings;