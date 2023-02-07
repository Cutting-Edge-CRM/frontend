import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listQuotes } from '../../api/quote.api';
import Table from '../../shared/Table'
import { quoteColumns } from '../../util/columns';
  

function Quotes(props: any) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [quotesAreLoading, setQuotesAreLoading] = useState(true);
  const [errorListingQuotes, setErrorListingQuotes] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    listQuotes(undefined, query, page, pageSize)
    .then((result) => {
      setQuotesAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setQuotesAreLoading(false);
      setErrorListingQuotes(err.message)
    })
  }, [page, pageSize, query])

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
          errorListing={errorListingQuotes}
          listLoading={quotesAreLoading}
          setQuery={setQuery}
          ></Table>
      </Box>
    )
}

export default Quotes;