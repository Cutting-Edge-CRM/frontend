import { Button, Card, Chip, Divider, Grid, List, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import EmptyState from '../../shared/EmptyState';

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


function ClientHubInvoiceDetails(props: any) {
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);


    return (
        <Card>
            {/* {loading && <LinearProgress />} */}
            <Stack direction="row">
                <Typography>Invoice Details</Typography>
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
                    <Chip label={props.invoice.invoice.status}/>
                </Stack>
            </Stack>
                {props.invoice.items.map(((item: any, index: number) => (
                    <InvoiceItemSaved key={index} item={item} {...props}/>
                )))}
                {props.invoice?.items?.length === 0 && <EmptyState type='invoice-items'/>}
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${props.invoice.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
            <Stack direction="row">
                <Typography>Taxes</Typography>
                <Typography>{(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax)*(props.invoice.items.map((i: any) => i.price).reduce(add, 0))}</Typography>
            </Stack>
            <Divider/>
            <List>
                {props.payments.map((payment: any) => (
                    <Stack direction={'row'}>
                        <Typography>Deposit collected {dayjs(payment.transDate).format('MMM D')}</Typography>
                        <Typography>${payment.amount}</Typography>
                    </Stack>
                ))}
            </List>
            {props.invoice.invoice.status === 'Awaiting Payment' && 
            <>
                <Button
                >Pay Invoice
                </Button>
            </>
                }
        </Card>
    )
}

export default ClientHubInvoiceDetails;