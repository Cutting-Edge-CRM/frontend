import { CalendarMonthOutlined } from '@mui/icons-material';
import { Alert, Box, Card, CircularProgress, Grid, List, ListItem, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listQuotes } from '../../api/quote.api';


function ClientHubQuotes(props: any) {
    const [rows, setRows] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let { clientId } = useParams();  

    useEffect(() => {
        listQuotes(clientId)
        .then((result) => {
            setLoading(false);
            setRows(result.rows);
        }, (err) => {
            setLoading(false);
            setError(err.message)
        })
      }, [clientId])

    return (
        <Box>
            <Stack direction="row">
                <Typography>Quotes</Typography>
            </Stack>
            {loading && (<CircularProgress />)}
            {error && (<Alert severity="error">{error}</Alert>)}
            {!loading && !error &&
                <List>
                {
                    rows?.map((quote: any) => (
                        <ListItem key={quote.id}>
                            <Card>
                                <Grid container spacing={2}>
                                    <Grid item={true} xs={2}>
                                        <CalendarMonthOutlined/>
                                    </Grid>
                                    <Grid item={true} xs={8}>

                                    </Grid>
                                    <Grid item={true} xs={2}>
                                    </Grid>
                                </Grid>
                            </Card>
                        </ListItem>
                    ))
                }
                {rows.length === 0 && <Typography>This client doesn't have any quotes yet.</Typography>}
            </List>}
        </Box>
    )
}

export default ClientHubQuotes;