import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Grid, InputLabel, ListItemText, Menu, MenuItem, MenuList, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AddCircleOutlineOutlined, ExpandMore } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { updateSettings } from '../../api/settings.api';
import { AddressAutofill } from '@mapbox/search-js-react';
import RichText from '../../shared/richtext/RichText';


function EmailSmsSettings(props: any) {
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const QuoteEmailInputRef = React.useRef();
    const InvoiceEmailInputRef = React.useRef();
    const QuoteSMSInputRef = React.useRef();
    const InvoiceSMSInputRef = React.useRef();
    const ReceiptEmailInputRef = React.useRef();
    const [selectionStart, setSelectionStart] = React.useState(0);
    const [textFieldMenu, setTextFieldMenu] = useState('');
    const variables = [{display: "Client first name", id: "{{{client_first}}}"}, {display: "Client last name", id: "{{{client_last}}}"}, {display: "Price", id: "{{{total}}}"}]

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, textField: string) => {
        setAnchorEl(event.currentTarget);
        setTextFieldMenu(textField)
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const updateSelectionStart = (event: any) => {
        switch (event.target.id) {
            case 'sendQuoteEmailBody':
                setSelectionStart((QuoteEmailInputRef.current as any).selectionStart);
                break;
            case 'sendInvoiceEmailBody':
                setSelectionStart((InvoiceEmailInputRef.current as any).selectionStart);
                break;
            case 'sendQuoteSMSBody':
                setSelectionStart((QuoteSMSInputRef.current as any).selectionStart);
                break;
            case 'sendInvoiceSMSBody':
                setSelectionStart((InvoiceSMSInputRef.current as any).selectionStart);
                break;
            case 'sendReceiptEmailBody':
                setSelectionStart((ReceiptEmailInputRef.current as any).selectionStart);
                break;
            default:
                break;
        }
    }

    const insertVariable = (variable: string) => {
        switch (textFieldMenu) {
            case 'quote-email':
                props.setSettings({ ...props.settings, sendQuoteEmailBody: props.settings.sendQuoteEmailBody.slice(undefined,selectionStart) + variable + props.settings.sendQuoteEmailBody.slice(selectionStart,undefined)});
                break;
            case 'invoice-email':
                props.setSettings({ ...props.settings, sendInvoiceEmailBody: props.settings.sendInvoiceEmailBody.slice(undefined,selectionStart) + variable + props.settings.sendInvoiceEmailBody.slice(selectionStart,undefined)});
                break;
            case 'receipt-email':
                props.setSettings({ ...props.settings, sendReceiptEmailBody: props.settings.sendReceiptEmailBody.slice(undefined,selectionStart) + variable + props.settings.sendReceiptEmailBody.slice(selectionStart,undefined)});
                break;
            case 'quote-sms':
                props.setSettings({ ...props.settings, sendQuoteSMSBody: props.settings.sendQuoteSMSBody.slice(undefined,selectionStart) + variable + props.settings.sendQuoteSMSBody.slice(selectionStart,undefined)});
                break;
            case 'invoice-sms':
                props.setSettings({ ...props.settings, sendInvoiceSMSBody: props.settings.sendInvoiceSMSBody.slice(undefined,selectionStart) + variable + props.settings.sendInvoiceSMSBody.slice(selectionStart,undefined)});
                break;
            default:
                break;
        }
    }

    const handleChange = (event: any) => {
        if (props.settings.id) {
            props.setSettings({ ...props.settings, [event.target.id]: event.target.value });
        }
      };

    const handleSave = () => {
        updateSettings(props.settings)
        .then(res => {
            props.success('Successfully updated settings');   
        }, err => {
            setError(err);
        })
    }

    // const handleReload = () => {
    //     window.location.reload();
    // }

    return (
        <>
        {error && <Alert severity="error">{error}</Alert>}
            <Accordion sx={{ py: 3, px: 2, position: 'static' }}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            {/* for a very strange reason putting this making it style properly on mobile */}
            <AddressAutofill accessToken=''>
            <TextField sx={{display:'none'}} />
            </AddressAutofill>
            <Typography
            color={'primary'}
            variant='h6'
            >Quote Email Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid item xs={12} sm={6} >
                        <Typography
                        width="100%"
                        marginBottom={2}
                        variant="body2"
                        color="neutral.dark"
                        >Update how your email will look to clients when sending a quote via email.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
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
                        <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="quote-email-body-label" sx={{ color: 'primary.main' }}>
                                Email Body
                            </InputLabel>
                            <Button
                                startIcon={<AddCircleOutlineOutlined color="primary" />}
                                onClick={(e) => openMenu(e, 'quote-email')}
                            >
                                Add Variable
                            </Button>
                        </Stack>
                        <TextField
                            id="sendQuoteEmailBody"
                            multiline
                            minRows={5}
                            inputRef={QuoteEmailInputRef}
                            onSelect={updateSelectionStart}
                            value={
                            props.settings.sendQuoteEmailBody ? props.settings.sendQuoteEmailBody : `Hello,\n\nThank you for asking us to quote your painting project. You can access your quote by visiting the link below. Don't hesitate to let us know if you have any questions or concerns, and we look forward to working with you!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>                        
                    </Grid>
                </Grid>
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
                <Grid container>
                    <Grid item xs={12} sm={6} >
                    <Typography
                    width="100%"
                    marginBottom={2}
                    variant="body2"
                    color="neutral.dark"
                    >Update how your email will look to clients when sending an invoice via email.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
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
                        <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="invoice-email-body-label" sx={{ color: 'primary.main' }}>
                                Email Body
                            </InputLabel>
                            <Button
                                startIcon={<AddCircleOutlineOutlined color="primary" />}
                                onClick={(e) => openMenu(e, 'invoice-email')}
                            >
                                Add Variable
                            </Button>
                        </Stack>
                        <TextField
                            id="sendInvoiceEmailBody"
                            multiline
                            minRows={5}
                            inputRef={InvoiceEmailInputRef}
                            onSelect={updateSelectionStart}
                            value={
                            props.settings.sendInvoiceEmailBody ? props.settings.sendInvoiceEmailBody : `Hello,\n\nThank you for your business. You can access your invoice by visiting the link below. Don't hesitate to let us know if you have any questions or concerns regarding this invoice, and let us know if there's anything you need in the future!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
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
            >Receipt Email Template</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid item xs={12} sm={6} >
                    <Typography
                    width="100%"
                    marginBottom={2}
                    variant="body2"
                    color="neutral.dark"
                    >Update how your email will look to clients when sending a receipt via email.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
                        <InputLabel id="receipt-email-subject-label" sx={{ color: 'primary.main' }}>
                            Email Subject
                        </InputLabel>
                        <TextField
                            id="sendReceiptEmailSubject"
                            value={
                            props.settings.sendReceiptEmailSubject ? props.settings.sendReceiptEmailSubject : ``
                            }
                            onChange={handleChange}
                        />
                        <InputLabel id="receipt-email-replyTo-label" sx={{ color: 'primary.main' }}>
                            Reply To
                        </InputLabel>
                        <TextField
                            id="replyToReceiptEmail"
                            value={
                            props.settings.replyToReceiptEmail ? props.settings.replyToReceiptEmail : ''
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="invoice-email-body-label" sx={{ color: 'primary.main' }}>
                                Email Body
                            </InputLabel>
                            <Button
                                startIcon={<AddCircleOutlineOutlined color="primary" />}
                                onClick={(e) => openMenu(e, 'receipt-email')}
                            >
                                Add Variable
                            </Button>
                        </Stack>
                        <TextField
                            id="sendReceiptEmailBody"
                            multiline
                            minRows={5}
                            inputRef={ReceiptEmailInputRef}
                            onSelect={updateSelectionStart}
                            value={
                            props.settings.sendReceiptEmailBody ? props.settings.sendReceiptEmailBody : ``
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
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
                <Grid container>
                    <Grid item xs={12} sm={6} >
                    <Typography
                    width="100%"
                    marginBottom={2}
                    variant="body2"
                    color="neutral.dark"
                    >Update how your message will look to clients when sending a quote via text message.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
                    <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="quote-sms-body-label" sx={{ color: 'primary.main' }}>
                                Text message
                            </InputLabel>
                            <Button
                                startIcon={<AddCircleOutlineOutlined color="primary" />}
                                onClick={(e) => openMenu(e, 'quote-sms')}
                            >
                                Add Variable
                            </Button>
                        </Stack>
                        <TextField
                            id="sendQuoteSMSBody"
                            multiline
                            minRows={5}
                            inputRef={QuoteSMSInputRef}
                            onSelect={updateSelectionStart}
                            value={
                            props.settings.sendQuoteSMSBody ? props.settings.sendQuoteSMSBody : `Hello,\n\nThank you for asking us to quote your painting project. You can access your quote by visiting the link below. Don't hesitate to let us know if you have any questions or concerns, and we look forward to working with you!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
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
                <Grid container>
                    <Grid item xs={12} sm={6} >
                    <Typography
                    width="100%"
                    marginBottom={2}
                    variant="body2"
                    color="neutral.dark"
                    >Update how your message will look to clients when sending an invoice via text message.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
                    <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="invoice-sms-body-label" sx={{ color: 'primary.main' }}>
                                Text Message
                            </InputLabel>
                            <Button
                                startIcon={<AddCircleOutlineOutlined color="primary" />}
                                onClick={(e) => openMenu(e, 'invoice-sms')}
                            >
                                Add Variable
                            </Button>
                        </Stack>
                        <TextField
                            id="sendInvoiceSMSBody"
                            multiline
                            minRows={5}
                            inputRef={InvoiceSMSInputRef}
                            onSelect={updateSelectionStart}
                            value={
                            props.settings.sendInvoiceSMSBody ? props.settings.sendInvoiceSMSBody : `Hello,\n\nThank you for your business. You can access your invoice by visiting the link below. Don't hesitate to let us know if you have any questions or concerns regarding this invoice, and let us know if there's anything you need in the future!\n\n{{link}}`
                            }
                            onChange={handleChange}
                        />
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            {/* <Button variant="outlined" onClick={handleReload}>Cancel</Button> */}
                            <Button variant="contained"  onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
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
            >Terms & Conditions</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container>
                    <Grid item xs={12} sm={6} >
                    <Typography
                    width="100%"
                    marginBottom={2}
                    variant="body2"
                    color="neutral.dark"
                    >Update how your Terms & Conditions section will look on quotes and in the client hub.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <Stack spacing={2} width="100%">
                    <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                            <InputLabel id="terms-label" sx={{ color: 'primary.main' }}>
                                Terms & Conditions
                            </InputLabel>
                        </Stack>
                        <Box sx={{".quill": {height: '300px'}, height: {xs: '420px', sm: '370px'}}}>
                        <RichText
                        id="terms"
                        value={props.settings.terms ?? ''}
                        onChange={handleChange}
                        />
                        </Box>
                        <Stack direction={'row'} spacing={2} justifyContent="center">
                            <Button variant="contained"  onClick={handleSave}>Save Changes</Button>
                        </Stack>
                    </Stack>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
        <Menu
            id="menu"
            anchorEl={anchorEl}
            open={isOpen}
            onClose={closeMenu}
          >
            <MenuList>
                {variables.map((variable: any, index: any) => (
                <MenuItem key={index} onClick={() => insertVariable(variable.id)}>
                  <ListItemText>{variable.display}</ListItemText>
                </MenuItem>
                ))}
                
            </MenuList>
        </Menu>
        </>
    )
}

export default EmailSmsSettings;