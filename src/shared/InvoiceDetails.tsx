import { AddCircleOutlineOutlined, AttachMoney, DeleteOutline, FileDownloadOutlined, MarkEmailReadOutlined, MoneyOffOutlined, MoreVert, PersonOutline, SendOutlined } from '@mui/icons-material';
import { Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, Link, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateInvoice } from '../api/invoice.api';
import ConfirmDelete from './ConfirmDelete';
import EmptyState from './EmptyState';
import RichText from './RichText';

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

    const onDelete = () => {
        navigate(`/invoices`);
    }

    const markInvoiceAs = (status: string) => {
        closeMenu();
        props.invoice.invoice.status = status;
        updateInvoice(props.invoice)
        .then(res => {
        }, err => {
        })
    }

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
                            <MenuItem>
                                <ListItemIcon>
                                    <AttachMoney />
                                </ListItemIcon>
                                <ListItemText>Collect Payment</ListItemText>
                            </MenuItem>
                            <MenuItem>
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
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'invoices'}
            deleteId={props.invoice.invoice.id}
            onDelete={onDelete}
            />
        </Card>
    )
}

export default InvoiceDetails;