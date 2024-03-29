import { Box, Card, CircularProgress, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers, resendInvite } from '../../api/user.api';
import EmptyState from '../../shared/EmptyState';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CustomToolbar from '../../shared/CutomToolbar';
import EditEmployee from './EditEmployee';
import { AddressAutofill } from '@mapbox/search-js-react';
import dayjs from 'dayjs';
import { CreateOutlined, DeleteOutline, EmailOutlined, MoreVert } from '@mui/icons-material';
import { theme } from '../../theme/theme';
import ConfirmDelete from '../../shared/ConfirmDelete';
import { isAllowed } from '../../auth/FeatureGuards';
import { currentUser } from '../../auth/firebase';

function Employees(props: any) {
  const [rows, setRows] = useState([]);
  const [employeesAreLoading, setEmployeesAreLoading] = useState(true);
  const [errorListingEmployees, setErrorListingEmployees] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [employee, setEmployee] = useState(null as any);
  const [type, setType] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    setEmployee(row);
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setType('edit');
    setNewOpen(true);
  };

  const handleClose = () => {
    setNewOpen(false);
    setEmployee(null);
    closeMenu();
  };

  const handleNewOpen = () => {
    setType('new');
    setNewOpen(true);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
    closeMenu();
  };

  const onDelete = () => {
    return;
  }

  const handleResendInvite = () => {
    resendInvite(employee)
    .then(res => {
      props.success("Successfully sent invite");
    }, err => {
      
    })
  }

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
  }, [reload]);

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
      field: 'options',
      headerName: '',
      width: 50,
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <>
            <IconButton onClick={(e) => openMenu(e, params.row)}>
              <MoreVert color="primary" />
            </IconButton>
            <Menu
              id="visit-menu"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={closeMenu}
            >
              <MenuList>
                <Tooltip title={employee?.id === currentUser.uid ? "Edit your user in the 'Person Details' tab in settings" : ''}>
                <Box>
                <MenuItem onClick={handleEditOpen} disabled={employee?.id === currentUser.uid} >
                  <ListItemIcon>
                    <CreateOutlined />
                  </ListItemIcon>
                  <ListItemText>Edit Employee</ListItemText>
                </MenuItem>
                </Box>
                </Tooltip>
                <MenuItem onClick={handleResendInvite} disabled={employee?.id === currentUser.uid}>
                  <ListItemIcon>
                    <EmailOutlined />
                  </ListItemIcon>
                  <ListItemText>Resend Invite</ListItemText>
                </MenuItem>
                <Tooltip title={employee?.id === currentUser.uid ? "You can't delete your own user" : ''}>
                <Box>
                <MenuItem onClick={handleDeleteOpen} disabled={employee?.id === currentUser.uid}>
                  <ListItemIcon>
                    <DeleteOutline color="error" />
                  </ListItemIcon>
                  <ListItemText>Delete Employee</ListItemText>
                </MenuItem>
                </Box>
                </Tooltip>
              </MenuList>
            </Menu>
          </>
        );
      },
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
              {/* <IconButton sx={{padding: 0}} >
                <ArrowCircleRightOutlined color='primary'/>
              </IconButton> */}
            </Grid>
          </Grid>
        );
      }
    },
  ];

  if (!isAllowed('team-feature')) {
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
                disableColumnMenu
            />
            <EditEmployee
                open={newOpen}
                onClose={handleClose}
                success={props.success}
                employee={employee}
                setEmployee={setEmployee}
                type={type}
                reload={reload}
                setReload={setReload}
            />
              <ConfirmDelete
                open={deleteOpen}
                onClose={handleDeleteClose}
                type={'employee'}
                deleteId={employee?.id}
                onDelete={onDelete}
                success={props.success}
              />
            </Box>
            </Card>
        </Box>
    )
}

export default Employees;