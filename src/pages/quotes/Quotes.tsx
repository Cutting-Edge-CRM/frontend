import { Box } from '@mui/material';
import React from 'react';
import Table from '../../components/Table'
import { quoteColumns } from '../../util/columns';
  
  const rows = [
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
  

function Quotes() {

    return (
        
        <Box>
          <Table rows={rows} columns={quoteColumns} type="Quotes" title="Quotes"></Table>
      </Box>
    )
}

export default Quotes;