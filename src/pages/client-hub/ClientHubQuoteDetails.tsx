import { Box, Button, Card, Chip, Divider, Grid, List, Stack, Switch, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import EmptyState from '../../shared/EmptyState';
import ConfirmChangeStatus from './ConfirmChangeStatus';

function add(accumulator: any, a: any) {
    return (+accumulator) + (+a);
  }

function QuoteItem(props: any) {

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
                    <Stack>
                        <Typography>Service</Typography>
                        <Typography>{props.item.title}</Typography>
                    </Stack>
                </Grid>
                <Grid item={true} xs={4}>
                    {props.upsell && 
                    <Stack>
                        <Typography>Include</Typography>
                        <Switch
                        disabled={props.quote.quote.status !== 'Pending'}
                         id='selected' 
                         checked={props.item.selected === 1} 
                         onChange={handleCheck}></Switch>
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

function TabPanel(props: any) {

    const [depositAmount, setDepositAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [subTotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

      useEffect(() => {
        setSubtotalAmount(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0));
        setTaxAmount((+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)));
        setTotalAmount(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)))
        setDepositAmount(props.option.depositPercent ? (+props.option.deposit/100)*(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.option.tax)?.tax)*(props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))) : props.option.deposit);
      }, [props])

    return (
        <Box
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`option-${props.index}`}
        >
        {/* {props.value === props.index && ( */}
            <>
            {props.option.items.map(((item: any, index: number) => (
                <QuoteItem key={index} item={item} upsell={item.addon === 1} {...props}/>
            )))}
            {props.option?.items?.length === 0 && <EmptyState type='quote-items'/>}
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${subTotalAmount}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Taxes</Typography>
                <Typography>{taxAmount}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row">
                <Typography>Total</Typography>
                <Typography>${totalAmount}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Deposit</Typography>
                <Typography>${depositAmount}</Typography>
            </Stack>
            </>
        {/* )} */}
        </Box>
    );
}

function ClientHubQuoteDetails(props: any) {
    // const [value, setValue] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState('');


    // const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    //     if (newValue === 'add') {
    //         let options = props.quote.options;
    //         options.push(
    //         {
    //             deposit: 0,
    //             depositPercent: 0,
    //             tax: null,
    //             items: [{ price: 0}]
    //           });
    //         setValue(props.quote.options.length-1);
    //     } else {
    //         setValue(newValue);
    //     }
    // };

    const handleConfirmOpen = (status: string) => {
        setConfirmType(status);
        setConfirmOpen(true);
    };

    const handleConfirmClose = (value: string) => {
        setConfirmOpen(false);
    };

    return (
        <Card>
            {/* {loading && <LinearProgress />} */}
            <Stack direction="row">
                <Typography>Quote Details</Typography>
            </Stack>
            <Stack direction="row">
                <Stack>
                    <Typography>Client</Typography>
                    <Typography>Jim Halpert</Typography>
                </Stack>
                <Stack>
                    <Typography>Sent</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>Opened</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label={props.quote.quote.status}/>
                </Stack>
            </Stack>
            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                {props.quote.options?.map((_: any, index: number) => (
                    <Tab key={index} label={`Option ${index + 1}`} id={`${index + 1}`} />
                ))}
            </Tabs>
            </Box> */}
            {/* {props.quote.options?.map((option: any, index: number) => (
                    <TabPanel option={option} key={index} value={value} index={index} {...props}/>
                ))} */}
            <TabPanel option={props.quote.options?.[0]} {...props}/>
            <Divider/>
            <List>
                {props.payments.map((payment: any) => (
                    <Stack direction={'row'} key={payment.id}>
                        <Typography>Deposit collected {dayjs(payment.transDate).format('MMM D')}</Typography>
                        <Typography>${payment.amount}</Typography>
                    </Stack>
                ))}
            </List>
            {props.quote.quote.status === 'Pending' && 
            <>
                <Button
                onClick={() => handleConfirmOpen('Rejected')}
                >Reject
                </Button>
                <Button
                onClick={() => handleConfirmOpen('Approved')}
                >Approve
                </Button>
            </>
                }
            <ConfirmChangeStatus
            open={confirmOpen}
            onClose={handleConfirmClose}
            type={confirmType}
            price={props.quote.options?.[0].items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.quote.options?.[0].tax)?.tax)*(props.quote.options?.[0].items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))}
            success={props.success}
            {...props}
            />
        </Card>
    )
}

export default ClientHubQuoteDetails;