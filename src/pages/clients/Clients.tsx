import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '../../shared/Table';
import ImportClients from '../../shared/client/ImportClients';
import { clientColumns } from '../../util/columns';
import { listClients } from '../../api/client.api';

function Clients() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(10);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  useEffect(() => {
    listClients(undefined, page, pageSize)
    .then((result) => {
      setIsLoaded(true);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setIsLoaded(true);
      setError(err.message)
    })
  }, [page, pageSize]);

  if (error) {
    return (<Typography>{error}</Typography>);
  }
  if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
  }
    return (
        <Box>
          <Table 
          rows={rows} 
          columns={clientColumns} 
          onImportClick={handleClickOpen} 
          type="Clients" 
          title="Clients"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          rowCount={rowCount}
          ></Table>
          <ImportClients
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
        </Box>
    )
}

export default Clients;