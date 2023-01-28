import { SellOutlined } from '@mui/icons-material';
import { Alert, Box, Card, Chip, CircularProgress, Grid, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listQuotes } from '../../api/quote.api';


function ClientHubQuotes(props: any) {
    const [rows, setRows] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let { clientId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        listQuotes(clientId)
        .then((result) => {
            setLoading(false);
            setRows(result.rows.filter((q: any) => q.status !== 'Draft'));
            console.log(result.rows);
        }, (err) => {
            setLoading(false);
            setError(err.message)
        })
      }, [clientId])

    const handleClick = (quoteId: string) => {
        navigate(`/client-hub/${clientId}/quotes/${quoteId}`);
    }

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
                            <ListItemButton onClick={() => handleClick(quote.id)}>
                                <Grid container spacing={2}>
                                    <Grid item={true} xs={2}>
                                        <SellOutlined/>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Typography>{quote.address}</Typography>
                                        <Typography>{quote.price}</Typography>
                                    </Grid>
                                    <Grid item={true} xs={4}>
                                        <Chip label={quote.status}/>
                                    </Grid>
                                </Grid>
                                </ListItemButton>
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