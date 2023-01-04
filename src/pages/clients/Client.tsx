import React from 'react';
import { Typography } from '@mui/material';
import TabbedTable from '../../components/TabbedTable';
import Properties from '../../components/Properties';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../components/Contact';

const invoiceRows = [
    { id: 1, client: "Name" , price: 'Snow', balance: 'Jon', status: 35 },
    { id: 2, client: "Name" , price: 'Lannister', balance: 'Cersei', status: 42 },
    { id: 3, client: "Name" , price: 'Lannister', balance: 'Jaime', status: 45 },
    { id: 4, client: "Name" , price: 'Stark', balance: 'Arya', status: 16 },
    { id: 5, client: "Name" , price: 'Targaryen', balance: 'Daenerys', status: null },
    { id: 6, client: "Name" , price: 'Melisandre', balance: null, status: 150 },
    { id: 7, client: "Name" , price: 'Clifford', balance: 'Ferrara', status: 44 },
    { id: 8, client: "Name" , price: 'Frances', balance: 'Rossini', status: 36 },
    { id: 9, client: "Name" , price: 'Roxie', balance: 'Harvey', status: 65 },
  ];

const jobRows = [
    { id: 1, client: "Name" , address: 'Snow', price: 'Jon', status: 35 },
    { id: 2, client: "Name" , address: 'Lannister', price: 'Cersei', status: 42 },
    { id: 3, client: "Name" , address: 'Lannister', price: 'Jaime', status: 45 },
    { id: 4, client: "Name" , address: 'Stark', price: 'Arya', status: 16 },
    { id: 5, client: "Name" , address: 'Targaryen', price: 'Daenerys', status: null },
    { id: 6, client: "Name" , address: 'Melisandre', price: null, status: 150 },
    { id: 7, client: "Name" , address: 'Clifford', price: 'Ferrara', status: 44 },
    { id: 8, client: "Name" , address: 'Frances', price: 'Rossini', status: 36 },
    { id: 9, client: "Name" , address: 'Roxie', price: 'Harvey', status: 65 },
  ];

const quoteRows = [
    { id: 1, client: "Name" , address: 'Snow', price: 'Jon', status: 35 },
    { id: 2, client: "Name" , address: 'Lannister', price: 'Cersei', status: 42 },
    { id: 3, client: "Name" , address: 'Lannister', price: 'Jaime', status: 45 },
    { id: 4, client: "Name" , address: 'Stark', price: 'Arya', status: 16 },
    { id: 5, client: "Name" , address: 'Targaryen', price: 'Daenerys', status: null },
    { id: 6, client: "Name" , address: 'Melisandre', price: null, status: 150 },
    { id: 7, client: "Name" , address: 'Clifford', price: 'Ferrara', status: 44 },
    { id: 8, client: "Name" , address: 'Frances', price: 'Rossini', status: 36 },
    { id: 9, client: "Name" , address: 'Roxie', price: 'Harvey', status: 65 },
  ];

function Client() {
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <Properties />
                    <TabbedTable quoteRows={quoteRows} jobRows={jobRows} invoiceRows={invoiceRows} />
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact/>
                    <Typography>Visits</Typography>
                    <Typography>Notes</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Client;