import { Box, Chip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import Table from '../../components/Table'

const columns: GridColDef[] = [
    { 
        field: 'client',
        headerName: 'Client',
        width: 150 },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
    },
  ];
  
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
  

function Jobs() {

    return (
        
        <Box>
          <Table rows={rows} columns={columns} type="Jobs"></Table>
      </Box>
    )
}

export default Jobs;