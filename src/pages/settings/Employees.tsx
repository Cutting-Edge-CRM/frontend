import { Box, Card, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers } from '../../api/user.api';
import EmptyState from '../../shared/EmptyState';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from '../../shared/CutomToolbar';
import { employeeColumns } from '../../util/columns';
import EditEmployee from './EditEmployee';

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