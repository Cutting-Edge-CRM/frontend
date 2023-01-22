import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listQuotes } from '../../api/quote.api';
import Table from '../../shared/Table'
import { quoteColumns } from '../../util/columns';
  

function Quotes(props: any) {
  const [rows, setRows] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(10);

  useEffect(() => {
    listQuotes(undefined, undefined, page, pageSize)
    .then((result) => {
      setIsLoaded(true);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setIsLoaded(true);
      setError(err.message)
    })
  }, [page, pageSize])

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
          columns={quoteColumns} 
          type="Quotes" 
          title="Quotes"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          rowCount={rowCount}
          success={props.success}
          ></Table>
      </Box>
    )
}

export default Quotes;