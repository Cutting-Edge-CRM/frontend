import { EventAvailableOutlined, LocationOnOutlined, PersonOutline } from '@mui/icons-material';
import { Alert, Box, Card, Chip, CircularProgress, Divider, Grid, ListItemButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listQuotes } from '../../api/quote.api';
import { getChipColor } from '../../theme/theme';

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
            <Card sx={{marginBottom: 4, pt: 2}}>
            <Typography variant="h6" fontWeight={600}>Your Quotes</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} sx={{width: "70vw", '.MuiTabs-scroller': {overflowX: 'scroll !important', '::-webkit-scrollbar': {display: 'none'}}}} >
                <Tab label="Pending" id="pending" />
                <Tab label="Approved" id="approved" />
                <Tab label="Rejected" id="rejected" />
                <Tab label="Converted" id="converted" />
                <Tab label="Archived" id="archived" />
            </Tabs>
            </Box>
            </Card>
            {(['Pending', 'Approved', 'Rejected', 'Converted', 'Archived']).map((status, index) => (
                <TabPanel value={value} index={index} key={index}>
                <Grid container spacing={2}>
                {loading && (<Box textAlign='center'><CircularProgress /></Box>)}
                {error && (<Alert severity="error">{error}</Alert>)}
                {!loading && !error && rows?.filter((quote: any) => quote.status === status)?.map((quote: any) => (
                    <Grid item xs={12} md={6} lg={4} key={quote.id}>
                        <Card>
                            <ListItemButton onClick={() => handleClick(quote.id)}>
                                <Stack width={'100%'} spacing={2}>
                                    <Stack direction={'row'} justifyContent='space-between'>
                                        <Typography fontWeight={600} fontSize={18}>{`Quote #${quote.id}`}</Typography>
                                        <Chip label={quote.status}  sx={{backgroundColor: `${getChipColor(quote.status as string)}.main`, color: `${getChipColor(quote.status as string)}.dark`}} ></Chip>
                                    </Stack>
                                    <Divider/>
                                    <Grid container>
                                        <Grid item xs={2}><PersonOutline color='primary'/></Grid>
                                        <Grid item xs={10}><Typography color="primary" variant="body1">Client</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography variant="body1">{quote.clientName}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><LocationOnOutlined color='primary'/></Grid>
                                        <Grid item xs={10}><Typography color="primary" variant="body1">Address</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography variant="body1">{quote.address}</Typography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={2}><EventAvailableOutlined color='primary'/></Grid>
                                        <Grid item xs={10}><Typography color="primary" variant="body1">Sent</Typography></Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={10}><Typography variant="body1">11/23/2022</Typography></Grid>
                                    </Grid>
                                <Divider/>
                                <Stack direction={'row'} spacing={1} justifyContent='end'>
                                    <Typography variant="h6" color="primary" fontWeight={700}>Total</Typography>
                                    <Typography variant="h6" fontWeight={700}>{`$${quote.price}`}</Typography>
                                </Stack>
                                </Stack>
                                </ListItemButton>
                            </Card>
                    </Grid>))}
                </Grid>
                </TabPanel>
            ))}
            </>
        </Box>
    )
}

export default ClientHubQuotes;