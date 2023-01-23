import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listInvoices } from '../../api/invoice.api';
import Table from '../../shared/Table'
import { invoiceColumns } from '../../util/columns';

function Invoices(props: any) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [invoicesAreLoading, setInvoicesAreLoading] = useState(true);
  const [errorListingInvoices, setErrorListingInvoices] = useState(null);

  useEffect(() => {
    listInvoices(undefined, undefined, page, pageSize)
    .then((result) => {
      setInvoicesAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setInvoicesAreLoading(false);
      setErrorListingInvoices(err.message)
    })
  }, [page, pageSize])

    return (
        
        <Box>
          <Table 
          rows={rows} 
          columns={invoiceColumns} 
          type="Invoices" 
          title="Invoices"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          rowCount={rowCount}
          success={props.success}
          errorListing={errorListingInvoices}
          listLoading={invoicesAreLoading}
          ></Table>
      </Box>
    )
}

export default Invoices;