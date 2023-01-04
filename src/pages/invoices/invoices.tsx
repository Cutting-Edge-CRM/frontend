import { Box } from '@mui/material';
import React from 'react';
import Table from '../../components/Table'
import { invoiceColumns } from '../../util/columns';
  
  const rows = [
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
  

function Invoices() {

    return (
        
        <Box>
          <Table rows={rows} columns={invoiceColumns} type="Invoices" title="Invoices"></Table>
      </Box>
    )
}

export default Invoices;