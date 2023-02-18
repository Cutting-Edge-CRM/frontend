import { Box, Card, Chip, CircularProgress, Grid, IconButton, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers } from '../../api/user.api';
import EmptyState from '../../shared/EmptyState';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CustomToolbar from '../../shared/CutomToolbar';
import EditEmployee from './EditEmployee';
import { AddressAutofill } from '@mapbox/search-js-react';
import dayjs from 'dayjs';
import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { theme, getChipColor } from '../../theme/theme';

function Employees(props: any) {
  const [rows, setRows] = useState([]);
  const [employeesAreLoading, setEmployeesAreLoading] = useState(true);
  const [errorListingEmployees, setErrorListingEmployees] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [type, setType] = useState('');

  const handleRowClick = (event: any) => {
    setType('edit');
    setEmployee(event.row);
    setNewOpen(true);
  };

  const handleClose = () => {
    setNewOpen(false);
    setEmployee(null);
  };

  const handleNewOpen = () => {
    setType('new');
    setNewOpen(true);
  };

  const getEmptyState = () => {
    return (
      <EmptyState
        type='employees'
      />
    );
  };

  const getErrorState = () => {
    return (
      <>
        <CustomToolbar
          handleNewOpen={handleNewOpen}
          handleExportClients={props.handleExportClients}
          title={props.title}
          type={props.type}
          onImportClick={props.onImportClick}
        />
        <Typography>{errorListingEmployees}</Typography>
      </>
    );
  };

  const getLoadingState = () => {
    return <Box textAlign='center'><CircularProgress /></Box>;
  };


  useEffect(() => {
    listUsers()
    .then((result) => {
      setEmployeesAreLoading(false);
      setRows(result);
    }, (err) => {
      setEmployeesAreLoading(false);
      setErrorListingEmployees(err.message);
    })
  }, []);

  const employeeColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        flex: 1,
        hide: useMediaQuery(theme.breakpoints.down("sm")),
      },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      hide: useMediaQuery(theme.breakpoints.down("sm")),
    },
    {
      field: 'phone',
      headerName: 'Phone',
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
              <Typography whiteSpace={'pre-wrap'} color={'neutral.light'} >{params.row.email}</Typography>
            </Stack>
            </Grid>
            <Grid item xs={3} alignItems="center" display={'flex'}>
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

  if (props.subscription.subscription === 'basic') {
    return(
    <Card sx={{padding: 5}}>
      <Box borderRadius={'15px'} overflow={'hidden'}>
      <a href="/settings?tab=billing">
        <img src="https://res.cloudinary.com/dtjqpussy/image/upload/v1676494117/Untitled_design_2_memg3f.png"
        width={'100%'} alt="upgrade for timesheets"></img>
        </a>
      </Box>
      </Card>
    );
  }

    return (
        <Box>
            <Card>
              {/* for a very strange reason putting this making it style properly on mobile */}
              <AddressAutofill accessToken=''>
              <TextField sx={{display:'none'}} />
              </AddressAutofill>
            <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}}}>
            <DataGrid
                error={errorListingEmployees}
                loading={employeesAreLoading}
                autoHeight
                rows={rows}
                columns={employeeColumns}
                components={{
                Toolbar: CustomToolbar,
                NoRowsOverlay: getEmptyState,
                ErrorOverlay: getErrorState,
                LoadingOverlay: getLoadingState,
                }}
                componentsProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    handleNewOpen,
                    title: 'Employees',
                    type: 'employees',
                    subscription: props.subscription,
                    employeeCount: rows.length
                },
                ...props,
                }}
                disableSelectionOnClick
                onRowClick={handleRowClick}
            />
            <EditEmployee
                open={newOpen}
                onClose={handleClose}
                success={props.success}
                employee={employee}
                setEmployee={setEmployee}
                type={type}
            />
            </Box>
            </Card>
        </Box>
    )
}

export default Employees;