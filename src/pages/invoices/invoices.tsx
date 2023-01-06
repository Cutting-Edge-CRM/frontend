import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listInvoices } from '../../api/invoice.api';
import Table from '../../components/Table'
import { invoiceColumns } from '../../util/columns';

function Invoices() {
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    listInvoices()
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
          <Table rows={rows} columns={invoiceColumns} type="Invoices" title="Invoices"></Table>
      </Box>
    )
}

export default Invoices;