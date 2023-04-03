import {
  AddCircleOutlineOutlined,
  Close,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { listClients } from '../api/client.api';
import { listProperties } from '../api/property.api';
import { listUsers } from '../api/user.api';
import { createVisit } from '../api/visit.api';
import { theme } from '../theme/theme';
import NewClient from './client/NewClient';
import CustomPagination from './CustomPagination';
import EmptyState from './EmptyState';
import TimePickerV2 from './visit/TimePickerV2';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

const clientColumns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'contact',
    headerName: 'Contact',
    width: 150,
  },
];

export default function NewEvent(props: any) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [query, setQuery] = useState('');
  const [clientRows, setClientRows] = useState([]);
  const [clientsAreLoading, setClientsAreLoading] = useState(false);
  const [errorListingClients, setErrorListingClients] = useState(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(undefined);
  const [properties, setProperties] = useState([] as any[]);
  const [visit, setVisit] = useState({ users: [], property: '', anytime: true, type: selectedClient ? "Estimate" : "Task", notes: "" } as any);
  const [users, setUsers] = useState([] as any[]);

  const visitTypes = selectedClient ? ['Estimate', 'Task', 'Reminder'] : ['Task', 'Reminder'] ;


  const handleCancel = () => {
    props.onClose();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleCloseNewClient = (value: string) => {
    setNewClientOpen(false);
  };

  const handleSaveNewClient = (value: string) => {
    setNewClientOpen(false);
    // save value
  };

  const handleNewClientOpen = () => {
    setNewClientOpen(true);
  };

  const getClientEmptyState = () => {
    return <EmptyState type="clients" />;
  };


  const getClientErrorState = () => {
    return (
      <>
        <ClientToolbar />
        <Typography>{errorListingClients}</Typography>
      </>
    );
  };

  const getLoadingState = () => {
    return <Box textAlign='center'><CircularProgress /></Box>;
  };


  const handleFilterChange = (filterModel: any) => {
    setQuery(filterModel.quickFilterValues?.join(' '))
  }

  React.useEffect(() => {
    listClients(query, page, pageSize)
    .then((result) => {
      setClientsAreLoading(false);
      setClientRows(result?.rows);
      setRowCount(result?.rowCount?.[0]?.rowCount);
    }, (err) => {
      setClientsAreLoading(false);
      setErrorListingClients(err.message);
    })
  }, [page, pageSize, query, newClientOpen]);

  function ClientToolbar(props: any) {
    return (
      <GridToolbarContainer
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <GridToolbarQuickFilter variant="outlined" size="small" />
        {!useMediaQuery(theme.breakpoints.down("sm")) ?
        <Button
        onClick={handleNewClientOpen}
        startIcon={<AddCircleOutlineOutlined />}
        variant="contained"
      >
        Create New Client
      </Button>
      :
      <IconButton onClick={handleNewClientOpen}>
        <AddCircleOutlineOutlined color='primary' fontSize='large' />
      </IconButton>
      }
      </GridToolbarContainer>
    );
  }

  const handleClientRowClick = (event: any) => {
    setSelectedClient(event.row.id);
    handleNext();
  };

  const handleSave = () => {
    setLoading(true);
      // save value
      createVisit({
        ...visit,
        job: null,
        property: (typeof visit?.property === 'number')? visit.property : null,
        client: selectedClient,
        start: convertToDate('start'),
        displayEnd: convertToDate('end'),
        end: convertToDate('end'),
      }).then(
        (res) => {
          setLoading(false);
          props.onClose();
          props.success('Successfully created new visit');
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );

  };


  const handleChange = (event: any) => {
    setVisit({ ...visit, [event.target.id]: event.target.value });
  };

  const handleAnytime = (event: any) => {
    setVisit({ ...visit, [event.target.id]: event.target.checked });
  };

  const handleUnscheduled = (event: any) => {
    setVisit({ ...visit, [event.target.id]: event.target.checked });
  };

  const handStartChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(visit.start);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      setVisit({ ...visit, start: newDate }); 
    } else {
      setVisit({ ...visit, start: newTime }); 
    }
  };

  const handEndChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(visit.displayEnd);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      setVisit({ ...visit, displayEnd: newDate, end: newDate }); 
    } else {
      setVisit({ ...visit, displayEnd: newTime, end: newDate }); 
    }
  };

  const handDateChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(visit.start);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      setVisit({ ...visit, start: newDate, displayEnd: newDate, end: newDate }); 
    } else {
      setVisit({ ...visit, start: newTime, displayEnd: newDate, end: newDate }); 
    }
  }

  const handleChangePerson = (event: SelectChangeEvent<any>) => {
    setVisit({ ...visit, users: event.target.value });
  };

  const handleChangeProperty = (event: SelectChangeEvent<any>) => {
    setVisit({ ...visit, property: event.target.value.id });
  };

  const handleChangeType = (event: SelectChangeEvent<any>) => {
    setVisit({ ...visit, type: event.target.value });
  };

  const handleStartTimeChange = (time: string) => {
    let newTime = dayjs(time);
    let newDate = dayjs(visit.start);
    newDate = newDate.set('hour', newTime.get("hour"));
    newDate = newDate.set('minute', newTime.get("minute"));
    setVisit({ ...visit, start: newDate });
  };

  const handleEndTimeChange = (time: string) => {
    let newTime = dayjs(time);
    let newDate = dayjs(visit.displayEnd);
    newDate = newDate.set('hour', newTime.get("hour"));
    newDate = newDate.set('minute', newTime.get("minute"));
    setVisit({ ...visit, displayEnd: newDate, end: newDate }); 
 };

  const checkValid = () => {
    if ((!dayjs(visit.start).isValid() || !dayjs(visit.displayEnd).isValid()) && !visit.unscheduled) return false;
    return true;
  }

  const convertToDate = (type: string) => {
    if (visit.unscheduled) return null;
    if (type === 'start') {
      return dayjs(visit.start).toISOString();
    } else {
      return dayjs(visit.displayEnd).toISOString();
    }
  };

  useEffect(() => {
    listProperties(selectedClient).then(
      (result: any[]) => {
        setProperties(result);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, [selectedClient]);


  useEffect(() => {
    listUsers().then(
      (result: any) => {
        setUsers(result);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open}>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
      <DialogTitle align="center">New Event</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress sx={{marginBottom: 2}} />}
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Select Client</StepLabel>
            </Step>
            <Step>
              <StepLabel>Event Details</StepLabel>
            </Step>
          </Stepper>
          <Box mt={4}>
            {activeStep === 0 ? (
              <Stack spacing={2}>
              <Box sx={{ width: '100%', mt: 2, '& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'} }}>
                  <DataGrid
                      autoHeight
                      rows={clientRows}
                      columns={clientColumns}
                      pagination
                      pageSize={pageSize}
                      rowsPerPageOptions={[10, 20, 50]}
                      rowCount={rowCount}
                      onPageChange={(newPage) => setPage(newPage)}
                      page={page}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      paginationMode="server"
                      filterMode="server"
                      onFilterModelChange={handleFilterChange}
                      disableColumnMenu
                      components={{
                      Toolbar: ClientToolbar,
                      NoRowsOverlay: getClientEmptyState,
                      ErrorOverlay: getClientErrorState,
                      LoadingOverlay: getLoadingState,
                      Pagination: CustomPagination,
                      }}
                      loading={clientsAreLoading}
                      error={errorListingClients}
                      componentsProps={{
                      toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                      },
                      ...props,
                      }}
                      onRowClick={handleClientRowClick}
                  />
              </Box>
              </Stack>
            ) : (
              <Stack spacing={1.5} mt={2}>
              <InputLabel id="type-label" sx={{ color: 'primary.main' }}>
                  Visit type
              </InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={visit?.type ?? "Estimate"}
                onChange={handleChangeType}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected}
                  </Box>
                )}
              >
                {visitTypes.map((type: any) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={type === visit.type} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
              {selectedClient &&
              <>
                <InputLabel id="property-label" sx={{ color: 'primary.main' }}>
                  Property
                </InputLabel>
                <Select
                  labelId="property-label"
                  id="property"
                  value={properties.find((p) => p.id === visit.property) ?? ''}
                  displayEmpty={true}
                  onChange={handleChangeProperty}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected?.address}
                      {selected.length === 0 && (
                        <Typography>None</Typography>
                      )}
                    </Box>
                    
                  )}
                >
                  {properties.map((property: any) => (
                    <MenuItem key={property.id} value={property}>
                      <Checkbox checked={property.id === visit.property} />
                      <ListItemText primary={property.address} />
                    </MenuItem>
                  ))}
                </Select>
                </>
              }
              <InputLabel id="assigned-label" sx={{ color: 'primary.main' }}>
                Assigned
              </InputLabel>
              <Select
                labelId="assigned-label"
                id="assigned"
                multiple
                value={visit.users}
                onChange={handleChangePerson}
                input={<OutlinedInput label="Assign team members" />}
                displayEmpty={true}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: any) => (
                      <Chip
                        key={value.id}
                        label={value.name ? value.name : value.email}
                      />
                    ))}
                    {selected.length === 0 && (
                      <Typography>No users are currently assigned</Typography>
                    )}
                  </Box>
                )}
              >
                {users.map((user: any) => (
                  <MenuItem key={user.id} value={user}>
                    <Checkbox
                      checked={
                        visit.users?.map((p: any) => p.id).indexOf(user.id) >
                        -1
                      }
                    />
                    <ListItemText primary={user.name ? user.name : user.email} />
                  </MenuItem>
                ))}
              </Select>
              <InputLabel id="notes-label" sx={{ color: 'primary.main' }}>
                  Notes
              </InputLabel>
              <TextField
                  id="notes"
                  multiline
                  minRows={5}
                  value={
                  visit.notes ?? ""
                  }
                  onChange={handleChange}
              />
              <InputLabel id="schedule-label" sx={{ color: 'primary.main' }}>
                Schedule
              </InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    id="unscheduled"
                    checked={+visit.unscheduled === (1 || true)}
                    onChange={handleUnscheduled}
                  />
                }
                label="Unscheduled"
              />
              {visit?.type === 'Job' ? 
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <DatePicker
                    label="Start Date"
                    disabled={+visit.unscheduled === (1 || true)}
                    value={visit.start}
                    maxDate={visit.displayEnd}
                    onChange={handStartChange}
                    renderInput={(params) => <TextField {...params} />}
                    OpenPickerButtonProps={{
                      color: 'primary',
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    disabled={+visit.unscheduled === (1 || true)}
                    value={visit.displayEnd}
                    minDate={visit.start}
                    onChange={handEndChange}
                    renderInput={(params) => <TextField {...params} />}
                    OpenPickerButtonProps={{
                      color: 'primary',
                    }}
                  />
              </Stack>
              :
              <>
              <Stack direction="row" justifyContent="center" width="100%">
                <DatePicker
                  label="Date"
                  disabled={+visit.unscheduled === (1 || true)}
                  value={visit.start}
                  onChange={handDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  OpenPickerButtonProps={{
                    color: 'primary',
                  }}
                />
              </Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    id="anytime"
                    disabled={+visit.unscheduled === (1 || true) || (dayjs(visit.displayEnd).diff(visit.start, 'days') >= 1)}
                    checked={+visit.anytime === (1 || true) || +visit.unscheduled === (1 || true) || (dayjs(visit.displayEnd).diff(visit.start, 'days') >= 1)}
                    onChange={handleAnytime}
                  />
                }
                label="Anytime"
              />
                <Stack direction="row" spacing={1}>
                  <TimePickerV2
                    disabled={+visit.anytime === (1 || true) || +visit.unscheduled === (1 || true) || (dayjs(visit.displayEnd).diff(visit.start, 'days') >= 1)}
                    label="Start Time"
                    value={visit.start}
                    onChange={handleStartTimeChange}
                  />
                  <TimePickerV2
                    disabled={+visit.anytime === (1 || true) || +visit.unscheduled === (1 || true) || (dayjs(visit.displayEnd).diff(visit.start, 'days') >= 1)}
                    label="End Time"
                    value={visit.displayEnd}
                    onChange={handleEndTimeChange}
                  />
                </Stack>
              </>
              }
              <Stack direction="row"></Stack>
            </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        {activeStep === 1 ? (
          <Button
            disabled={!checkValid()}
            onClick={handleSave}
            variant="contained"
          >
            Create
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
          >
            {selectedClient ? 'Next' : 'Skip'}
          </Button>
        )}
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
      <NewClient
        open={newClientOpen}
        onClose={handleCloseNewClient}
        update={handleSaveNewClient}
      />
    </Dialog>
  );
}
