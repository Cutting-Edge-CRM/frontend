import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { Box, Chip, Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { listQuotes } from '../../api/quote.api';
import Table from '../../shared/Table'
import { getChipColor, theme } from '../../theme/theme';
  

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

  const quoteColumns: GridColDef[] = [
    { 
      field: 'clientName',
      headerName: 'Client',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
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
              <Typography whiteSpace={'pre-wrap'} color={'neutral.light'} >{params.row.address}</Typography>
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