import { Box, Chip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import Table from '../../components/Table'
import ImportClients from './ImportClients';

const columns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        width: 150 },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
    },
    {
      field: 'contact',
      headerName: 'Contact',
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
    { id: 1, name: "Name" , address: 'Snow', contact: 'Jon', status: 35 },
    { id: 2, name: "Name" , address: 'Lannister', contact: 'Cersei', status: 42 },
    { id: 3, name: "Name" , address: 'Lannister', contact: 'Jaime', status: 45 },
    { id: 4, name: "Name" , address: 'Stark', contact: 'Arya', status: 16 },
    { id: 5, name: "Name" , address: 'Targaryen', contact: 'Daenerys', status: null },
    { id: 6, name: "Name" , address: 'Melisandre', contact: null, status: 150 },
    { id: 7, name: "Name" , address: 'Clifford', contact: 'Ferrara', status: 44 },
    { id: 8, name: "Name" , address: 'Frances', contact: 'Rossini', status: 36 },
    { id: 9, name: "Name" , address: 'Roxie', contact: 'Harvey', status: 65 },
  ];
  

function Clients() {

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

    return (
        
        <Box>
          <Table rows={rows} columns={columns} onImportClick={handleClickOpen}></Table>
          <ImportClients
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
      </Box>
    )
}

export default Clients;