import { AddCircleOutlineOutlined, ArchiveOutlined, AttachMoney, Check, ContentCopyOutlined, DeleteOutline, FileDownloadOutlined, FormatPaintOutlined, MarkEmailReadOutlined, MoreVert, PersonOutline, SendOutlined, ThumbDownAltOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Card, Checkbox, Chip, Divider, Grid, IconButton, InputAdornment, LinearProgress, Link, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Select, Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, updateJob } from '../../api/job.api';
import { updateQuote } from '../../api/quote.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Duplicate from '../../shared/Duplicate';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from '../../shared/PaymentModal';
import RichText from '../../shared/RichText';
import SendQuoteModal from '../../shared/SendQuoteModal';

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
                    {props.upsell && 
                    <Stack>
                        <Typography>Recommended</Typography>
                        <Switch disabled checked={props.item.selected === 1}></Switch>
                    </Stack>
                    }
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

    const handleDeleteItem = () => {
        let options = props.quote.options;
        let option = options.find((op: any) => op === props.option);
        let item = option.items.find((it: any) => it === props.item);
        let itemIndex = option.items.indexOf(item);
        options.find((op: any) => op === props.option).items = option.items.slice(undefined, itemIndex).concat(option.items.slice(itemIndex+1, undefined));
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <TextField
                    id="title" 
                    label="Service"
                    error={!props.item.title?.trim()?.length}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    value={props.item.title ? props.item.title : ''}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item={true} xs={4}>
                    {props.upsell && 
                    <Stack>
                        <Typography>Recommended</Typography>
                        <Switch id='selected' checked={props.item.selected === 1} onChange={handleCheck}></Switch>
                    </Stack>
                    }
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
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        value={props.item.price ? props.item.price : ''}
                        onChange={handleChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText content={props.item.description ? props.item.description : ''} {...props} type='quote'/>
                <Button onClick={handleDeleteItem} startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
            <Divider/>
        </>
    );
}

function TabPanel(props: any) {

    const [depositAmount, setDepositAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [subTotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

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

      const handleChangeTax = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).tax = event.target.value.id;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
        
      };

      useEffect(() => {
        setSubtotalAmount(props.option.items.map((i: any) => i.price).reduce(add, 0));
        setTaxAmount((+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.map((i: any) => i.price).reduce(add, 0)));
        setTotalAmount(props.option.items.map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.map((i: any) => i.price).reduce(add, 0)))
        setDepositAmount(props.option.depositPercent ? (+props.option.deposit/100)*(props.option.items.map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.map((i: any) => i.price).reduce(add, 0))) : props.option.deposit);
      }, [props])

      const handleAddItem = () => {
        let options = props.quote.options;
        let items = props.option.items;
        items.push({price: 0});
        options.find((op: any) => op === props.option).items = items;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      }

    const handleAddUpsell = () => {
        let options = props.quote.options;
        let items = props.option.items;
        items.push({price: 0, addon: 1});
        options.find((op: any) => op === props.option).items = items;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      }

    return (
        <Box
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`option-${props.index}`}
        >
        {props.value === props.index && (
            <>
            {props.editting && 
                <>
                {props.option.items.map(((item: any, index: number) => (
                    <QuoteItemEdit key={index} item={item} upsell={item.addon === 1} {...props}/>
                )))}
                <Stack direction={'row'}>
                    <Button onClick={handleAddItem}>
                        <Stack>
                            <AddCircleOutlineOutlined />
                            <Typography>Add Item</Typography>
                        </Stack>
                    </Button>
                    <Button onClick={handleAddUpsell}>
                        <Stack>
                            <AddCircleOutlineOutlined />
                            <Typography>Add Upsell</Typography>
                        </Stack>
                    </Button>
                </Stack>
                </>
            }
            {!props.editting && 
                <>
                {props.option.items.map(((item: any, index: number) => (
                    <QuoteItemSaved key={index} item={item} upsell={item.addon === 1} {...props}/>
                )))}
                {props.job?.items?.length === 0 && <EmptyState type='quote-items'/>}
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${subTotalAmount}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Taxes</Typography>
                {props.editting ? 
                <Select
                labelId="tax-label"
                id="tax"
                value={props.taxes.find((t: any) => t.id === props.option.tax)}
                onChange={handleChangeTax}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.title}
                  </Box>
                )}
                >
                {props.taxes.map((tax: any) => (
                    <MenuItem key={tax.id} value={tax}>
                    <Checkbox checked={tax.id === props.option.tax} />
                    <ListItemText primary={tax.title} />
                    </MenuItem>
                ))}
                </Select>
                :
                <Typography>{taxAmount}</Typography>}
            </Stack>
            <Divider />
            <Stack direction="row">
                <Typography>Total</Typography>
                <Typography>${totalAmount}</Typography>
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
                    <Typography>${depositAmount}</Typography>
                }
            </Stack>
            </>
        )}
        </Box>
    );
}

function QuoteDetails(props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [value, setValue] = useState(0);
    const [editting, setEditting] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();
    const [duplicateOpen, setDuplicateOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [payment, setPayment] = useState({} as any);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [type, setType] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        if (newValue === 'add') {
            let options = props.quote.options;
            options.push(
            {
                deposit: 0,
                depositPercent: 0,
                tax: null,
                items: [{ price: 0}]
              });
            setValue(props.quote.options.length-1);
        } else {
            setValue(newValue);
        }
    };

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleEditting = () => {
        if (editting) {
            setLoading(true);
            updateQuote(props.quote)
            .then(res => {
                setLoading(false);
                props.success('Successfully updated quote');
            }, err => {
                setLoading(false);
                setError(err.message);
            })
        }
        setEditting(!editting);
    }

    const handleCancel = () => {
        setEditting(false);
        props.setReload(!props.reload);
    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = (value: string) => {
        setDeleteOpen(false);
        closeMenu();
    };

    const onDelete = () => {
        navigate(`/quotes`);
    }

    const handleDuplicateQuote = () => {
        setDuplicateOpen(true);
    }

    const handleSend = () => {
        setSendOpen(true);
    }

    const handleDuplicateClose = (value: string) => {
        setDuplicateOpen(false);
        setAnchorEl(null);
    };
    
    const handleSendClose = (value: string) => {
        setSendOpen(false);
        setAnchorEl(null);
    };

    const handlePaymentClose = () => {
        setPaymentOpen(false);
        setAnchorEl(null);
    }

    const handleNewDeposit = () => {
        setType('new');
        setPayment({
            client: props.quote.quote.client,
            type: 'deposit',
            typeId: props.quote.quote.id,
            details: `Deposit for quote #${props.quote.quote.id}`,
            transDate: dayjs(),
            method: 'Cheque',
            amount: (props.quote.options[value].depositPercent ? (+props.quote.options[value].deposit/100)*(props.quote.options[value].items.map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.quote.options[value].tax)?.tax)*(props.quote.options[value].items.map((i: any) => i.price).reduce(add, 0))) : props.quote.options[value].deposit)
        })
        setPaymentOpen(true);
    }

    const handleEditDeposit = (event: any, currPayment: any) => {
        setType('edit');
        setPayment(currPayment);
        setPaymentOpen(true);
    }

    const markQuoteAs = (status: string) => {
        closeMenu();
        props.quote.quote.status = status;
        updateQuote(props.quote)
        .then(res => {
            props.success('Status updated successfully');
        }, err => {
        })
    }
    
    const handleConvertToJob = () => {
        let job: any = {
            client: props.quote.quote.client,
            property: props.quote.quote.property,
            status: 'Active',
            quote: props.quote.quote.id
          };
        createJob(job)
        .then(res => {
            let updatingJob: any = {};
            updatingJob.job = job;
            updatingJob.job.id = res.id;
            let items: any[] = [];
            props.quote.options.forEach((op: any) => {
                items = items.concat(op.items.filter((it: any) => (it.addon !== 1) || (it.addon === 1 && it.selected === 1)));
            });
            updatingJob.items = items;
            updateJob(updatingJob)
            .then(_ => {
                props.quote.quote.status = 'Converted';
                props.quote.quote.job = res.id;
                updateQuote(props.quote)
                .then(res => {
                }, err => {
                })
                navigate(`/jobs/${res.id}`);
                props.success('Successfully converted quote to job');
            }, err => {

            })
        }, (err: any) => {
        })
    }


    return (
        <Card>
            {loading && <LinearProgress />}
            <Stack direction="row">
                <Typography>Quote Details</Typography>
                {editting ? 
                <><Button onClick={handleCancel}>Cancel</Button><Button onClick={handleEditting}>Save Changes</Button></>
                :
                <Button onClick={handleEditting}>Edit Quote</Button>
                }
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
                            {props.quote.quote.status !== ('Converted' || 'Pending') &&
                            <MenuItem onClick={() => markQuoteAs('Pending')}>
                                <ListItemIcon>
                                    <MarkEmailReadOutlined />
                                </ListItemIcon>
                                <ListItemText>Mark as Pending</ListItemText>
                            </MenuItem>
                            }
                            {props.quote.quote.status !== ('Converted' || 'Approved') && 
                            <MenuItem onClick={() => markQuoteAs('Approved')}>
                                <ListItemIcon>
                                    <Check />
                                </ListItemIcon>
                                <ListItemText>Mark as Approved</ListItemText>
                            </MenuItem>
                            }
                            {props.quote.quote.status !== ('Converted' || 'Rejected') && 
                            <MenuItem onClick={() => markQuoteAs('Rejected')}>
                                <ListItemIcon>
                                    <ThumbDownAltOutlined />
                                </ListItemIcon>
                                <ListItemText>Mark as Rejected</ListItemText>
                            </MenuItem>
                            }
                            <MenuItem onClick={handleNewDeposit}>
                                <ListItemIcon>
                                    <AttachMoney />
                                </ListItemIcon>
                                <ListItemText>Collect Deposit</ListItemText>
                            </MenuItem>
                            {props.quote.quote.status === 'Approved' &&
                            <MenuItem onClick={handleConvertToJob}>
                                <ListItemIcon>
                                    <FormatPaintOutlined />
                                </ListItemIcon>
                                <ListItemText>Convert to Job</ListItemText>
                            </MenuItem>
                            }
                            <MenuItem onClick={handleDuplicateQuote}>
                                <ListItemIcon>
                                    <ContentCopyOutlined />
                                </ListItemIcon>
                                <ListItemText>Duplicate</ListItemText>
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
                            {props.quote.quote.status !== ('Converted' || 'Archived') && 
                            <MenuItem onClick={() => markQuoteAs('Archived')}>
                                <ListItemIcon>
                                    <ArchiveOutlined />
                                </ListItemIcon>
                                <ListItemText>Archive</ListItemText>
                            </MenuItem>
                            }
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
                    <Typography>{props.quote.quote.created}</Typography>
                </Stack>
                <Stack>
                    <Typography>Opened by client</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>Used For</Typography>
                    {props.quote.quote.job ? <Link href={`/jobs/${props.quote.quote.job}`}>Job</Link> : <Typography>-</Typography>}
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label={props.quote.quote.status}/>
                </Stack>
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                {props.quote.options?.map((_: any, index: number) => (
                    <Tab key={index} label={`Option ${index + 1}`} id={`${index + 1}`} />
                ))}
                {editting && <Tab label={`Add Option`} value='add'/>}
            </Tabs>
            </Box>
            {props.quote.options?.map((option: any, index: number) => (
                    <TabPanel option={option} key={index} value={value} index={index} editting={editting} {...props}/>
                ))}
            <Divider/>
            <List>
                {props.payments.map((payment: any) => (
                    <ListItemButton key={payment.id} id={payment.id} onClick={(e) => handleEditDeposit(e, payment)}>
                    <Stack direction={'row'}>
                        <Typography>Deposit collected {dayjs(payment.transDate).format('MMM D')}</Typography>
                        <Typography>${payment.amount}</Typography>
                    </Stack>
                    </ListItemButton>
                ))}
            </List>
            {error && <Alert severity="error">{error}</Alert>}
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'quotes'}
            deleteId={props.quote.quote.id}
            onDelete={onDelete}
            success={props.success}
            />
            <Duplicate
            open={duplicateOpen}
            onClose={handleDuplicateClose}
            type={'Quote'}
            quote={props.quote}
            success={props.success}
            />
            <SendQuoteModal
            open={sendOpen}
            onClose={handleSendClose}
            type={'Quote'}
            quote={props.quote}
            success={props.success}
            settings={props.settings}
            />
            <PaymentModal
            payment={payment}
            setPayment={setPayment}
            open={paymentOpen}
            onClose={handlePaymentClose}
            paymentType={'Deposit'}
            type={type}
            success={props.success}
            />
        </Card>
    )
}

export default QuoteDetails;