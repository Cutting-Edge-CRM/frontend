import { AddCircleOutlineOutlined, AttachMoney, DeleteOutline, FileDownloadOutlined, MarkEmailReadOutlined, MoneyOffOutlined, MoreVert, PersonOutline, SendOutlined } from '@mui/icons-material';
import { Box, Button, Card, Checkbox, Chip, Divider, Grid, IconButton, InputAdornment, Link, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Select, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateInvoice } from '../../api/invoice.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from '../../shared/PaymentModal';
import RichText from '../../shared/RichText';
import SendModal from '../../shared/SendModal';

function add(accumulator: number, a: number) {
    return (+accumulator) + (+a);
  }

function InvoiceItemSaved(props: any) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Service</Typography>
                        <Typography>{props.item.title}</Typography>
                    </Stack>
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Total</Typography>
                        <Typography>${props.item.price}</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <Divider/>
                <Typography dangerouslySetInnerHTML={{__html: props.item.description}}></Typography>
            </Stack>
            <Divider/>
        </>
    );
}

function InvoiceItemEdit(props: any) {

    const handleChange = (event: any) => {
        let items = props.invoice.items;
        items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        props.setInvoice({
            ...props.invoice,
            items: items
        });
      };

      const handleDeleteItem = () => {
        let invoice = props.invoice;
        let item = invoice.items.find((it: any) => it === props.item);
        let itemIndex = invoice.items.indexOf(item);
        let items = invoice.items.slice(undefined, itemIndex).concat(invoice.items.slice(itemIndex+1, undefined));
        props.setInvoice({
            ...props.invoice,
            items: items
        });
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <TextField
                    id="title" 
                    label="Service"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={props.item.title ? props.item.title : ''}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <TextField
                        id="price" 
                        label="Price"
                        type='number'
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline />
                            </InputAdornment>
                            ),
                        }}
                        value={props.item.price ? props.item.price : ''}
                        onChange={handleChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText content={props.item.description ? props.item.description : ''} {...props}  type='invoice'/>
                <Button onClick={handleDeleteItem} startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
            <Divider/>
        </>
    );
}

function InvoiceDetails(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [editting, setEditting] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();
    const [sendOpen, setSendOpen] = useState(false);
    const [payment, setPayment] = useState({} as any);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [type, setType] = useState('');

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleEditting = () => {
        if (editting) {
            updateInvoice(props.invoice)
            .then(res => {
            }, err => {
            })
        }
        setEditting(!editting);
    }

    const handleAddItem = () => {
        let items = props.invoice.items;
        items.push({price: 0});
        props.setInvoice({
            ...props.invoice,
            items: items
        });
      }

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = (value: string) => {
        setDeleteOpen(false);
        closeMenu();
    };

    const handleSend = () => {
        setSendOpen(true);
    }
    
    const handleSendClose = (value: string) => {
        setSendOpen(false);
        setAnchorEl(null);
    };

    const onDelete = () => {
        navigate(`/invoices`);
    }

    const handlePaymentClose = () => {
        setPaymentOpen(false);
        setAnchorEl(null);
    }

    const handleNewPayment = () => {
        setType('new');
        setPayment({
            client: props.invoice.invoice.client,
            type: 'payment',
            typeId: props.invoice.invoice.id,
            details: `Payment for invoice #${props.invoice.invoice.id}`,
            transDate: dayjs(),
            method: 'Cheque',
            amount: (props.invoice.invoice.depositPercent ? (+props.invoice.invoice.deposit/100)*(props.invoice.invoice.items.map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax)*(props.invoice.invoice.items.map((i: any) => i.price).reduce(add, 0))) : props.invoice.invoice.deposit)
        })
        setPaymentOpen(true);
    }

    const handleEditPayment = (event: any, currPayment: any) => {
        setType('edit');
        setPayment(currPayment);
        setPaymentOpen(true);
    }

    const markInvoiceAs = (status: string) => {
        closeMenu();
        props.invoice.invoice.status = status;
        updateInvoice(props.invoice)
        .then(res => {
        }, err => {
        })
    }

    const handleChangeTax = (event: any) => {
        let invoice = props.invoice.invoice;
        invoice.tax = event.target.value.id;
        props.setInvoice({
            ...props.invoice,
            invoice: invoice
        });
      };

    return (
        <Card>
            <Stack direction="row">
                <Typography>Invoice Details</Typography>
                <Button onClick={handleEditting}>{editting ? 'Save Changes' : 'Edit Invoice'}</Button>
                <IconButton
                    onClick={openMenu}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="visit-menu"
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={closeMenu}
                    >
                        <MenuList>
                            <MenuItem>
                                <ListItemIcon onClick={() => markInvoiceAs('Awaiting Payment')}>
                                    <MarkEmailReadOutlined />
                                </ListItemIcon>
                                <ListItemText>Mark as Sent</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => markInvoiceAs('Bad Debt')}>
                                <ListItemIcon>
                                    <MoneyOffOutlined />
                                </ListItemIcon>
                                <ListItemText>Mark as Bad Debt</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleNewPayment}>
                                <ListItemIcon>
                                    <AttachMoney />
                                </ListItemIcon>
                                <ListItemText>Collect Payment</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleSend}>
                                <ListItemIcon>
                                    <SendOutlined />
                                </ListItemIcon>
                                <ListItemText>Send</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <FileDownloadOutlined />
                                </ListItemIcon>
                                <ListItemText>Download PDF</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleDeleteOpen}>
                                <ListItemIcon>
                                    <DeleteOutline />
                                </ListItemIcon>
                                <ListItemText>Delete quote</ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Menu>
            </Stack>
            <Stack direction="row">
                <Stack>
                    <Typography>Created</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>Opened</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>From</Typography>
                    {props.invoice.invoice.job ? <Link href={`/jobs/${props.invoice.invoice.job}`}>Job</Link> : <Typography>-</Typography>}
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label="Upcoming"/>
                </Stack>
            </Stack>
            {editting && 
                <>
                {props.invoice.items.map(((item: any, index: number) => (
                    <InvoiceItemEdit key={index} item={item} {...props}/>
                )))}
                <Button onClick={handleAddItem}>
                    <Stack>
                        <AddCircleOutlineOutlined />
                        <Typography>Add Item</Typography>
                    </Stack>
                </Button>
                </>
            }
            {!editting && 
                <>
                {props.invoice.items.map(((item: any, index: number) => (
                    <InvoiceItemSaved key={index} item={item} {...props}/>
                )))}
                {props.invoice?.items?.length === 0 && <EmptyState type='invoice-items'/>}
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${props.invoice.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Taxes</Typography>
                {editting ? 
                <Select
                labelId="tax-label"
                id="tax"
                value={props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)}
                onChange={handleChangeTax}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.title}
                  </Box>
                )}
                >
                {props.taxes.map((tax: any) => (
                    <MenuItem key={tax.id} value={tax}>
                    <Checkbox checked={tax.id === props.invoice.invoice.tax} />
                    <ListItemText primary={tax.title} />
                    </MenuItem>
                ))}
                </Select>
                :
                <Typography>{(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax)*(props.invoice.items.map((i: any) => i.price).reduce(add, 0))}</Typography>}
            </Stack>
            <Divider/>
            <List>
                {props.payments.map((payment: any) => (
                    <ListItemButton key={payment.id} id={payment.id} onClick={(e) => handleEditPayment(e, payment)}>
                    <Stack direction={'row'}>
                        <Typography>Deposit collected {dayjs(payment.transDate).format('MMM D')}</Typography>
                        <Typography>${payment.amount}</Typography>
                    </Stack>
                    </ListItemButton>
                ))}
            </List>
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'invoices'}
            deleteId={props.invoice.invoice.id}
            onDelete={onDelete}
            />
            <SendModal
            open={sendOpen}
            onClose={handleSendClose}
            type={'Invoice'}
            quote={props.invoice}
            />
            <PaymentModal
            payment={payment}
            setPayment={setPayment}
            open={paymentOpen}
            onClose={handlePaymentClose}
            paymentType={'Payment'}
            type={type}
            />
        </Card>
    )
}

export default InvoiceDetails;