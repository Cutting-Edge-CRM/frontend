import { Box } from '@mui/material';
import React from 'react';
import Table from '../../components/Table';
import ImportClients from '../../components/ImportClients';
import { clientColumns } from '../../util/columns';
  
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
          <Table rows={rows} columns={clientColumns} onImportClick={handleClickOpen} type="Clients" title="Clients"></Table>
          <ImportClients
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
      </Box>
    )
}

export default Clients;