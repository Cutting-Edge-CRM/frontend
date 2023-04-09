import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { Box, Chip, Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { listInvoices } from '../../api/invoice.api';
import { isAllowed } from '../../auth/FeatureGuards';
import Table from '../../shared/Table'
import { getChipColor, theme } from '../../theme/theme';

function Invoices(props: any) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [invoicesAreLoading, setInvoicesAreLoading] = useState(true);
  const [errorListingInvoices, setErrorListingInvoices] = useState(null);
  const [query, setQuery] = useState('');
  const [sortModal, setSortModal] = useState([]);

  useEffect(() => {
    listInvoices(undefined, query, page, pageSize, sortModal)
    .then((result) => {
      setInvoicesAreLoading(false);
      setRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setInvoicesAreLoading(false);
      setErrorListingInvoices(err.message)
    })
  }, [page, pageSize, query, sortModal])

  const invoiceColumns: GridColDef[] = [
    { 
        field: 'clientName',
        headerName: 'Client',
        flex: 1 ,
        hide: useMediaQuery(theme.breakpoints.down("sm")),
      },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          isAllowed('view-pricing') ? params.value : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>
        );
      }
    },
    {
      field: 'paymentSum',
      headerName: 'Balance',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          isAllowed('view-pricing') ? <Typography>{Math.max(params.row.price - params.row.paymentSum, 0)}</Typography> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
      renderCell: (params: GridRenderCellParams<string>) => {    
        return (
          <Chip label={params.value} color="success" sx={{backgroundColor: `${getChipColor(params.value as string)}.main`, color: `${getChipColor(params.value as string)}.dark`}} />
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
              <Typography whiteSpace={'pre-wrap'} fontWeight={'500'}>{params.row.clientName}</Typography>
              {isAllowed('view-pricing') ? <Typography whiteSpace={'pre-wrap'} color={'neutral.light'} >${params.row.price}</Typography> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>}
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
          setQuery={setQuery}
          sortModal={sortModal}
          setSortModal={setSortModal}
          ></Table>
      </Box>
    )
}

export default Invoices;