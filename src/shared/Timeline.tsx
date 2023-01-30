import { Alert, Box, Card, CircularProgress, List, ListItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';


function Timeline(props: any) {
    const [rows, setRows] = useState([] as any);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (props.client) {

            // client created
            // quotes created
            // quotes sent
            // quotes approved
            // jobs created
            // invoices created
            // invoices sent
            // deposits on all quotes
            // payments on all invoices

        } else if (props.quote) {

            // quotes created
            // quotes sent
            // quotes approved
            // deposits on all quotes


        } else if (props.invoice) {

            // deposit on connected quotes
            // invoices created
            // invoices sent
            // payments on all invoices

        }
    })
  
    if (error) {
    return (<Alert severity="error">{error}</Alert>);
    }
    if (!isLoaded) {
    return (<Box textAlign='center'><CircularProgress /></Box>);
    }

    return (
        <Card>
            <Typography>Timeline</Typography>
            <List>
                {
                    rows.map((event: any) => (
                        <ListItem key={event.id}>

                        </ListItem>
                    ))
                }
            </List>
        </Card>
    )
}

export default Timeline;