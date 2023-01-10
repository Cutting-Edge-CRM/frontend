import { CreateOutlined, DeleteOutline, MoreVert, PersonOutline } from '@mui/icons-material';
import { Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
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
            invoice: props.invoice.invoice,
            items: items
        });
      };

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
                    value={props.item.title}
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
                        value={props.item.price}
                        onChange={handleChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText type='invoice' content={props.item.description} {...props}/>
                <Button startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
            <Divider/>
        </>
    );
}

function InvoiceDetails(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [editting, setEditting] = React.useState(false);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleEditting = () => {
        setEditting(!editting);
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
                                <ListItemIcon>
                                    <CreateOutlined />
                                </ListItemIcon>
                                <ListItemText>Edit Property</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <DeleteOutline />
                                </ListItemIcon>
                                <ListItemText>Delete Property</ListItemText>
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
                    <Typography>From</Typography>
                    <Typography>Invoice 3</Typography>
                </Stack>
                <Stack>
                    <Typography>Used for</Typography>
                    <Typography>Invoice 2</Typography>
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
                </>
            }
            {!editting && 
                <>
                {props.invoice.items.map(((item: any, index: number) => (
                    <InvoiceItemSaved key={index} item={item} {...props}/>
                )))}
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${props.invoice.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
        </Card>
    )
}

export default InvoiceDetails;