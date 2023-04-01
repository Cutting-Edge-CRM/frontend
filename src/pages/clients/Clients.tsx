import { Box, Chip, Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '../../shared/Table';
import ImportClients from '../../shared/client/ImportClients';
import { exportClients, listClients } from '../../api/client.api';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getChipColor, theme } from '../../theme/theme';
import dayjs from 'dayjs';
import { ArrowCircleRightOutlined } from '@mui/icons-material';


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
  const [sortModal, setSortModal] = useState([]);

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
    listClients(query, page, pageSize, sortModal)
    .then((result) => {
      setClientsAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setClientsAreLoading(false);
      setErrorListingClients(err.message);
    })
  }, [page, pageSize, query, sortModal]);

 const clientColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        flex: 1,
        hide: useMediaQuery(theme.breakpoints.down("sm"))
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm"))
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm"))
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} sx={{backgroundColor: `${getChipColor(params.value as string)}.main`, color: `${getChipColor(params.value as string)}.dark`}} />
        );
      }
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Typography>{dayjs(params.value).format('MM/DD/YYYY')}</Typography>
        );
      }
    },
    {
      field: 'mobile',
      headerName: '',
      flex: 1,
      hide: !useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {  
        return (
          <Grid container >
            <Grid item xs={7} >
            <Stack>
              <Typography whiteSpace={'pre-wrap'} fontWeight={'500'}>{params.row.name}</Typography>
              <Typography whiteSpace={'pre-wrap'} color={'neutral.light'} >{params.row.contact}</Typography>
            </Stack>
            </Grid>
            <Grid item xs={3} alignItems="center" display={'flex'}>
              <Chip label={params.row.status} sx={{backgroundColor: `${getChipColor(params.row.status as string)}.main`, color: `${getChipColor(params.row.status as string)}.dark`}} />
            </Grid>
            <Grid item xs={2} justifyContent="right" display={'flex'}>
              <IconButton sx={{padding: 0}} >
                <ArrowCircleRightOutlined color='primary'/>
              </IconButton>
            </Grid>
          </Grid>
        );
      }
    },

  ];

    return (
        <Box>
          <Table 
          mobile={useMediaQuery(theme.breakpoints.down("sm"))}
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
          sortModal={sortModal}
          setSortModal={setSortModal}
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