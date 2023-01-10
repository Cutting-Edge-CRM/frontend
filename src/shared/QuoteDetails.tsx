import { CreateOutlined, DeleteOutline, MoreVert, PersonOutline } from '@mui/icons-material';
import { Box, Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Select, Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';
import RichText from './RichText';

function add(accumulator: any, a: any) {
    return (+accumulator) + (+a);
  }

function QuoteItemSaved(props: any) {
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
                    <Stack>
                        <Typography>Add-on</Typography>
                        <Switch disabled checked={props.item.addon === 1}></Switch>
                    </Stack>
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

function QuoteItemEdit(props: any) {

    const handleChange = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      };

    const handleCheck = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.checked ? 1 : 0;
        props.setQuote({
            quote: props.quote.quote,
            options: options
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
                    <Stack>
                        <Typography>Add-on</Typography>
                        <Switch id='addon' checked={props.item.addon === 1} onChange={handleCheck}></Switch>
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
                        value={props.item.price}
                        onChange={handleChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText content={props.item.description} {...props}/>
                <Button startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
            <Divider/>
        </>
    );
}

function TabPanel(props: any) {

    const handleChangeDeposit = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option)[event.target.id] = event.target.value;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      };

      const handleChangePercent = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).depositPercent = event.target.value;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      };

    return (
        <Box
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`option-${props.index}`}
        aria-labelledby={`options-${props.index}`}
        >
        {props.value === props.index && (
            <>
            {props.editting && 
                <>
                {props.option.items.map(((item: any, index: number) => (
                    <QuoteItemEdit key={index} item={item} {...props}/>
                )))}
                </>
            }
            {!props.editting && 
                <>
                {props.option.items.map(((item: any, index: number) => (
                    <QuoteItemSaved key={index} item={item} {...props}/>
                )))}
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${props.option.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Deposit</Typography>
                {props.editting ? 
                    <><TextField 
                        id="deposit"
                        label="Deposit"
                        value={props.option.deposit}
                        onChange={handleChangeDeposit}
                        />
                    <Select
                        labelId="deposit-percent-select-label"
                        id="depositPercent"
                        value={props.option.depositPercent ? 1 : 0}
                        label="$/%"
                        onChange={handleChangePercent}
                    >
                        <MenuItem value={1}>%</MenuItem>
                        <MenuItem value={0}>$</MenuItem>
                    </Select></>
                :
                    <Typography>{props.option.depositPercent ? '' : '$'}{props.option.deposit}{props.option.depositPercent ? '%' : ''}</Typography>
                }
            </Stack><Stack direction="row">
                <Typography>Taxes</Typography>
                {/* {props.editting ? <Select placeholder='Select tax'/> : <Typography>$35</Typography>} */}
            </Stack><Divider /><Stack direction="row">
                <Typography>Total</Typography>
                <Typography>${props.option.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
            </>
        )}
        </Box>
    );
}

function QuoteDetails(props: any) {
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
                                <ListItemText>Send Quote</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <DeleteOutline />
                                </ListItemIcon>
                                <ListItemText>Mark quote as sent</ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Menu>
            </Stack>
            <Stack direction="row">
                <Stack>
                    <Typography>Created</Typography>
                    <Typography>{props.quote.quote.created}</Typography>
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
                    <Chip label={props.quote.quote.status}/>
                </Stack>
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="options">
                {props.quote.options?.map((_: any, index: number) => (
                    <Tab key={index} label={`Option ${index + 1}`} id={`${index + 1}`} />
                ))}
            </Tabs>
            </Box>
            {props.quote.options?.map((option: any, index: number) => (
                    <TabPanel option={option} key={index} value={value} index={index} editting={editting} {...props}/>
                ))}
        </Card>
    )
}

export default QuoteDetails;