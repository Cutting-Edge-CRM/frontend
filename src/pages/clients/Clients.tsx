import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import ImportClients from '../../components/ImportClients';
import { clientColumns } from '../../util/columns';
import { listClients } from '../../api/client.api';

function Clients() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  useEffect(() => {
    listClients()
    .then((result) => {
      setIsLoaded(true);
      setRows(result)
    }, (err) => {
      setIsLoaded(true);
      setError(err.message)
    })
  }, [])

  if (error) {
    return (<Typography>{error}</Typography>);
  }
  if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
  }
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