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
    // navigate(`/${props.type}/${event.id}`);
  };

  const handleClose = () => {
    setNewOpen(false);
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
            />
            </Box>
            </Card>
        </Box>
    )
}

export default Employees;