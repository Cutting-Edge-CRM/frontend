import { Box, Card, CardHeader, Chip, Grid, IconButton, Stack, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listQuotes } from '../../api/quote.api';
import { listJobs } from '../../api/job.api';
import { listInvoices } from '../../api/invoice.api';
import TabbedTable from './TabbedTable';
import dayjs from 'dayjs';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getChipColor, theme } from '../../theme/theme';
import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { isAllowed } from '../../auth/FeatureGuards';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

function TabbedSummary(props: any) {
  const [value, setValue] = useState(0);
  const [quoteRows, setQuoteRows] = useState([]);
  const [quotesAreLoading, setQuotesAreLoading] = useState(true);
  const [quotesError, setQuotesError] = useState(null);
  const [jobRows, setJobRows] = useState([]);
  const [jobsAreLoading, setJobsAreLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [invoicesAreLoading, setInvoicesAreLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState(null);

  let mobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    listQuotes(props.client).then(
      (result) => {
        setQuotesAreLoading(false);
        setQuoteRows(result?.rows);
      },
      (err) => {
        setQuotesAreLoading(false);
        setQuotesError(err.message);
      }
    );
    listJobs(props.client).then(
      (result) => {
        setJobsAreLoading(false);
        setJobRows(result?.rows);
      },
      (err) => {
        setJobsAreLoading(false);
        setJobsError(err.message);
      }
    );
    listInvoices(props.client).then(
      (result) => {
        setInvoicesAreLoading(false);
        setInvoiceRows(result?.rows);
      },
      (err) => {
        setInvoicesAreLoading(false);
        setInvoicesError(err.message);
      }
    );
  }, [props.client, props.reload]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          isAllowed('view-pricing') ? params.value : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>
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
              <Typography color={'neutral.light'} >{params.row.address}</Typography>
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

  const jobColumns: GridColDef[] = [
    { 
      field: 'clientName',
      headerName: 'Client',
      flex: 1 ,
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
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          isAllowed('view-pricing') ? params.value : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>
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
      field: 'balance',
      headerName: 'Balance',
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
              {isAllowed('view-pricing') ? <Typography whiteSpace={'pre-wrap'} color={'neutral.light'} >{params.row.price}</Typography> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>}
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
    <Card>
      <CardHeader title="Overview" />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Quotes" id="quotes" />
          <Tab label="Jobs" id="jobs" />
          <Tab label="Invoices" id="invoices" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TabbedTable
          mobile={mobile}
          rows={quoteRows}
          columns={quoteColumns}
          type="Quotes"
          title={null}
          client={props.client}
          success={props.success}
          errorListing={quotesError}
          loadingList={quotesAreLoading}
          reload={props.reload} 
          setReload={props.setReload}
        ></TabbedTable>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabbedTable
          mobile={mobile}
          rows={jobRows}
          columns={jobColumns}
          type="Jobs"
          title={null}
          client={props.client}
          success={props.success}
          errorListing={jobsError}
          loadingList={jobsAreLoading}
          reload={props.reload} 
          setReload={props.setReload}
        ></TabbedTable>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TabbedTable
          mobile={mobile}
          rows={invoiceRows}
          columns={invoiceColumns}
          type="Invoices"
          title={null}
          client={props.client}
          success={props.success}
          errorListing={invoicesError}
          loadingList={invoicesAreLoading}
          reload={props.reload} 
          setReload={props.setReload}
        ></TabbedTable>
      </TabPanel>
    </Card>
  );
}

export default TabbedSummary;
