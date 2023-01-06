import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listQuotes } from '../../api/quote.api';
import Table from '../../components/Table'
import { quoteColumns } from '../../util/columns';
  

function Quotes() {
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    listQuotes()
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
          <Table rows={rows} columns={quoteColumns} type="Quotes" title="Quotes"></Table>
      </Box>
    )
}

export default Quotes;