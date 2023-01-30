import { AttachMoney, EventAvailableOutlined, PersonOutline } from '@mui/icons-material';
import { Alert, Box, Card, Chip, CircularProgress, Divider, Grid, ListItemButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listInvoices } from '../../api/invoice.api';

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        {...other}
        >
        {value === index && (
            <Box>
            {children}
            </Box>
        )}
        </Box>
    );
}


function ClientHubInvoices(props: any) {
    const [rows, setRows] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let { clientId } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    useEffect(() => {
        listInvoices(clientId)
        .then((result) => {
            setLoading(false);
            setRows(result.rows.filter((q: any) => q.status !== 'Draft'));
        }, (err) => {
            setLoading(false);
            setError(err.message)
        })
      }, [clientId])

    const handleClick = (invoiceId: string) => {
        navigate(`/client-hub/${clientId}/invoices/${invoiceId}`);
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    return (
        <Box>
            <>
            <Card>
            <Typography>Your Invoices</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Awaiting Payment" id="awaiting" />
                <Tab label="Paid" id="paid" />
            </Tabs>
            </Box>
            </Card>
            {(['Awaiting Payment', 'Paid']).map((status, index) => (
                <TabPanel value={value} index={index} key={index}>
                <Grid container spacing={2}>
                {loading && (<CircularProgress />)}
                {error && (<Alert severity="error">{error}</Alert>)}
                {!loading && !error && rows?.filter((invoice: any) => invoice.status === status)?.map((invoice: any) => (
                    <Grid item xs={4} key={invoice.id}>
                        <Card>
                            <ListItemButton onClick={() => handleClick(invoice.id)}>
                                <Stack width={'100%'}>
                                    <Stack direction={'row'}>
                                        <Typography>{`Invoice #${invoice.id}`}</Typography>
                                        <Chip label={invoice.status}></Chip>
                                    </Stack>
                                    <Divider/>
                                    <Grid container>
                                        <Grid item xs={2}><PersonOutline/></Grid>
                                        <Grid item xs={10}><Typography>Client</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>{invoice.clientName}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><AttachMoney/></Grid>
                                        <Grid item xs={10}><Typography>Total</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>{invoice.price}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><EventAvailableOutlined/></Grid>
                                        <Grid item xs={10}><Typography>Sent</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>11/23/2022</Typography></Grid>
                                    </Grid>
                                <Divider/>
                                <Stack direction={'row'}>
                                    <Typography>Balance</Typography>
                                    <Typography>{`$${invoice.price}`}</Typography>
                                </Stack>
                                </Stack>
                                </ListItemButton>
                            </Card>
                    </Grid>))}
                </Grid>
                {rows?.filter((invoice: any) => invoice.status === status)?.length === 0 && <Typography>{`No ${status} Invoices`}</Typography>}
                </TabPanel>
            ))}
            </>
        </Box>
    )
}

export default ClientHubInvoices;