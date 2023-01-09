import { CreateOutlined, DeleteOutline, MoreVert, PersonOutline } from '@mui/icons-material';
import { Box, Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Select, Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';
import RichText from './RichText';

function QuoteItemSaved(props: any) {
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
                    <Stack>
                        <Typography>Add-on</Typography>
                        <Switch></Switch>
                    </Stack>
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

function QuoteItemEdit(props: any) {

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
                    <Stack>
                        <Typography>Add-on</Typography>
                        <Switch></Switch>
                    </Stack>
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

function TabPanel(props: any) {
    const { children, value, index, editting, ...other } = props;

    return (
        <Box
        role="tabpanel"
        hidden={value !== index}
        id={`option-${index}`}
        aria-labelledby={`options-${index}`}
        {...other}
        >
        {value === index && (
            <>
            {props.editting && 
                <>
                <QuoteItemEdit />
                <QuoteItemEdit />
                <QuoteItemEdit />
                </>
            }
            {!props.editting && 
                <>
                <QuoteItemSaved />
                <QuoteItemSaved />
                <QuoteItemSaved />
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
            </>
        )}
        </Box>
    );
}

function QuoteDetails() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [value, setValue] = React.useState(0);
    const [editting, setEditting] = React.useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

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
                <Typography>Quote Details</Typography>
                <Button onClick={handleEditting}>{editting ? 'Save Changes' : 'Edit Quote'}</Button>
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
                    <Typography>From</Typography>
                    <Typography>Job 2</Typography>
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label="Booked"/>
                </Stack>
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="options">
                <Tab label="Option 1" id="1" />
                <Tab label="Option 2" id="2" />
                <Tab label="Option 3" id="3" />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0} editting={editting}/>
            <TabPanel value={value} index={1} editting={editting}/>
            <TabPanel value={value} index={2} editting={editting}/>
        </Card>
    )
}

export default QuoteDetails;