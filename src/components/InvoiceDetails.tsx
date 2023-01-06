import { CreateOutlined, DeleteOutline, MoreVert, PersonOutline } from '@mui/icons-material';
import { Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Select, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import RichText from './RichText';

function InvoiceItemSaved(props: any) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Service</Typography>
                        <Typography>Bathroom</Typography>
                    </Stack>
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Total</Typography>
                        <Typography>$329</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <Divider/>
                <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
            </Stack>
        </>
    );
}

function InvoiceItemEdit(props: any) {

    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <TextField
                    id="service" 
                    label="Service"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <TextField
                        id="price" 
                        label="Price"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline />
                            </InputAdornment>
                            ),
                        }}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText/>
                <Button startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
        </>
    );
}

function InvoiceDetails() {
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
                    <Typography>Opened by client</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>Used for</Typography>
                    <Typography>Job 2</Typography>
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label="Booked"/>
                </Stack>
            </Stack>
            {editting && 
                <>
                <InvoiceItemEdit />
                <InvoiceItemEdit />
                <InvoiceItemEdit />
                </>
            }
            {!editting && 
                <>
                <InvoiceItemSaved />
                <InvoiceItemSaved />
                <InvoiceItemSaved />
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>$329</Typography>
            </Stack><Stack direction="row">
                <Typography>Deposit</Typography>
                {editting ? <TextField id="deposit" label="$ or %"/> : <Typography>$50</Typography>}
            </Stack><Stack direction="row">
                <Typography>Taxes</Typography>
                {editting ? <Select placeholder='Select tax'/> : <Typography>$35</Typography>}
            </Stack><Divider /><Stack direction="row">
                <Typography>Total</Typography>
                <Typography>$314</Typography>
            </Stack>
        </Card>
    )
}

export default InvoiceDetails;