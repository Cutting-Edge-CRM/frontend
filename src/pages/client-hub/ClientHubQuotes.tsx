import { EventAvailableOutlined, LocationOnOutlined, PersonOutline } from '@mui/icons-material';
import { Alert, Box, Card, Chip, CircularProgress, Divider, Grid, ListItemButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listQuotes } from '../../api/quote.api';

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


function ClientHubQuotes(props: any) {
    const [rows, setRows] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let { clientId } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    useEffect(() => {
        listQuotes(clientId)
        .then((result) => {
            setLoading(false);
            setRows(result.rows.filter((q: any) => q.status !== 'Draft'));
        }, (err) => {
            setLoading(false);
            setError(err.message)
        })
      }, [clientId])

    const handleClick = (quoteId: string) => {
        navigate(`/client-hub/${clientId}/quotes/${quoteId}`);
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    return (
        <Box>
            <>
            <Card>
            <Typography>Your Quotes</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Pending" id="pending" />
                <Tab label="Approved" id="approved" />
                <Tab label="Rejected" id="rejected" />
                <Tab label="Archived" id="archived" />
            </Tabs>
            </Box>
            </Card>
            {(['Pending', 'Approved', 'Rejected', 'Archived']).map((status, index) => (
                <TabPanel value={value} index={index} key={index}>
                <Grid container spacing={2}>
                {loading && (<CircularProgress />)}
                {error && (<Alert severity="error">{error}</Alert>)}
                {!loading && !error && rows?.filter((quote: any) => quote.status === status)?.map((quote: any) => (
                    <Grid item xs={4} key={quote.id}>
                        <Card>
                            <ListItemButton onClick={() => handleClick(quote.id)}>
                                <Stack width={'100%'}>
                                    <Stack direction={'row'}>
                                        <Typography>{`Quote #${quote.id}`}</Typography>
                                        <Chip label={quote.status}></Chip>
                                    </Stack>
                                    <Divider/>
                                    <Grid container>
                                        <Grid item xs={2}><PersonOutline/></Grid>
                                        <Grid item xs={10}><Typography>Client</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>{quote.client}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><LocationOnOutlined/></Grid>
                                        <Grid item xs={10}><Typography>Address</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>{quote.address}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><EventAvailableOutlined/></Grid>
                                        <Grid item xs={10}><Typography>Sent</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography>11/23/2022</Typography></Grid>
                                    </Grid>
                                <Divider/>
                                <Stack direction={'row'}>
                                    <Typography>Total</Typography>
                                    <Typography>{`$${quote.price}`}</Typography>
                                </Stack>
                                </Stack>
                                </ListItemButton>
                            </Card>
                    </Grid>))}
                </Grid>
                {rows?.filter((quote: any) => quote.status === status)?.length === 0 && <Typography>{`No ${status} Quotes`}</Typography>}
                </TabPanel>
            ))}
            </>
        </Box>
    )
}

export default ClientHubQuotes;