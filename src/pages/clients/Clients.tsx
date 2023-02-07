import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '../../shared/Table';
import ImportClients from '../../shared/client/ImportClients';
import { clientColumns } from '../../util/columns';
import { exportClients, listClients } from '../../api/client.api';


function Clients(props: any) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [rows, setRows] = useState([]);
  const [clientsAreLoading, setClientsAreLoading] = useState(true);
  const [errorListingClients, setErrorListingClients] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [query, setQuery] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const buildCSV = (obj: any) => {
    const array = [Object.keys(obj[0])].concat(obj)

    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }

  const handleExportClients = () => {
    exportClients()
    .then((result) => { 
      const blob = new Blob([buildCSV(result)], { type: 'text/csv;charset=utf-8,' })
      const objUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', objUrl)
      link.setAttribute('download', 'Clients.csv')
      link.click();
    }, err => {

    })
  }

  useEffect(() => {
    listClients(query, page, pageSize)
    .then((result) => {
      setClientsAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setClientsAreLoading(false);
      setErrorListingClients(err.message);
    })
  }, [page, pageSize, query]);

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
          handleExportClients={handleExportClients}
          success={props.success}
          errorListing={errorListingClients}
          listLoading={clientsAreLoading}
          setQuery={setQuery}
          ></Table>
          <ImportClients
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            success={props.success}
          />
        </Box>
    )
}

export default Clients;