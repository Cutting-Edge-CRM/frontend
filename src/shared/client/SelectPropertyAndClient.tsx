import { AddCircleOutlineOutlined, Close } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listClients } from '../../api/client.api';
import { createJob, updateJob } from '../../api/job.api';
import { listProperties } from '../../api/property.api';
import { createQuote, updateQuote } from '../../api/quote.api';
import { theme } from '../../theme/theme';
import CustomPagination from '../CustomPagination';
import EmptyState from '../EmptyState';
import EditProperty from '../property/EditProperty';
import NewClient from './NewClient';

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

const propertyColumns: GridColDef[] = [
  {
    field: 'address',
    headerName: 'Address',
    width: 150,
  },
  {
    field: 'city',
    headerName: 'City',
    width: 150,
  },
];

export default function SelectPropertyAndClient(props: any) {
  const [client, setClient] = useState({} as any);
  const [property, setProperty] = useState({} as any);
  const [activeStep, setActiveStep] = useState(0);
  const [clientRows, setClientRows] = useState([]);
  const [propertyRows, setPropertyRows] = useState([]);
  const [clientsAreLoading, setClientsAreLoading] = useState(false);
  const [errorListingClients, setErrorListingClients] = useState(null);
  const [propertiesAreLoading, setPropertiesAreLoading] = useState(true);
  const [errorListingProperties, setErrorListingProperties] = useState(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newPropertyOpen, setNewPropertyOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = () => {
    props.onClose();
  };

  const handleBack = () => {
    setPropertyRows([]);
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleClientRowClick = (event: any) => {
    setClient(event.row);
    setActiveStep(1);
  };

  const handlePropertyRowClick = (event: any) => {
    setLoading(true);
    setProperty(event.row);
    switch (props.type) {
      case 'Jobs':
        let job: any = {
          client: client.id,
          property: event.row.id,
          status: 'Active',
        };
        createJob(job).then(
          (res) => {
            let updatingJob: any = {};
            updatingJob.job = job;
            updatingJob.job.id = res.id;
            updatingJob.items = [{ job: res.id, price: 0 }];
            updateJob(updatingJob).then(
              (_) => {
                setLoading(false);
                navigate(`/jobs/${res.id}`);
                props.onClose();
                props.success('Successfully created new job');
              },
              (err) => {
                setLoading(false);
                setError(err.message);
              }
            );
          },
          (err: any) => {
            setLoading(false);
            setError(err.message);
          }
        );

        break;
      case 'Quotes':
        let quote: any = {
          client: client.id,
          property: event.row.id,
          status: 'Draft',
        };
        createQuote(quote).then(
          (res) => {
            let updatingQuote: any = {};
            updatingQuote.quote = quote;
            updatingQuote.quote.id = res.id;
            updatingQuote.options = [
              {
                quote: res.id,
                deposit: 0,
                depositPercent: 0,
                tax: null,
                items: [{ quote: res.id, price: 0 }],
              },
            ];
            updateQuote(updatingQuote).then(
              (_) => {
                setLoading(false);
                navigate(`/quotes/${res.id}`);
                props.success('Successfully created new quote');
              },
              (err) => {
                setLoading(false);
                setError(err.message);
              }
            );
          },
          (err) => {
            setLoading(false);
            setError(err.message);
          }
        );
        break;
      default:
        break;
    }
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

  const handleCloseNewProperty = (value: string) => {
    setNewPropertyOpen(false);
  };

  const handleSaveNewProperty = (value: string) => {
    setNewPropertyOpen(false);
    // save value
  };

  const handleNewPropertyOpen = () => {
    setNewPropertyOpen(true);
  };

  const getClientEmptyState = () => {
    return <EmptyState type="clients" />;
  };

  const getPropertiesEmptyState = () => {
    return <EmptyState type="properties" />;
  };

  const getClientErrorState = () => {
    return (
      <>
        <ClientToolbar />
        <Typography>{errorListingClients}</Typography>
      </>
    );
  };

  const getPropertyErrorState = () => {
    return (
      <>
        <PropertyToolbar />
        <Typography>{errorListingProperties}</Typography>
      </>
    );
  };

  const getLoadingState = () => {
    return <Box textAlign='center'><CircularProgress /></Box>;
  };

  useEffect(() => {
    listClients().then(
      (result) => {
        setClientsAreLoading(false);
        setClientRows(result.rows);
      },
      (err) => {
        setErrorListingClients(err.message);
        setClientsAreLoading(false);
      }
    );
  }, [newClientOpen]);

  useEffect(() => {
    setPropertiesAreLoading(true);
    if (!client) return;
    listProperties(client.id).then(
      (result) => {
        setPropertyRows(result);
        setPropertiesAreLoading(false);
      },
      (err) => {
        setErrorListingProperties(err.message);
        setPropertiesAreLoading(false);
      }
    );
  }, [client, activeStep, newPropertyOpen]);

  function SelectStepper(props: any) {
    return (
      <>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Select Client</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select Property</StepLabel>
          </Step>
        </Stepper>
        <Box mt={2}>
          {activeStep === 0 ? (
            <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}}}>
              <DataGrid
                autoHeight
                rows={clientRows}
                disableColumnMenu
                columns={clientColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                loading={clientsAreLoading}
                error={errorListingClients}
                components={{
                  Toolbar: ClientToolbar,
                  NoRowsOverlay: getClientEmptyState,
                  ErrorOverlay: getClientErrorState,
                  LoadingOverlay: getLoadingState,
                  Pagination: CustomPagination,
                }}
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
          ) : (
            <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}, '& .MuiDataGrid-footerContainer': {display: 'none'}}}>
              <DataGrid
                autoHeight
                rows={propertyRows}
                columns={propertyColumns}
                pageSize={10}
                disableColumnMenu
                rowsPerPageOptions={[10, 20, 50]}
                loading={propertiesAreLoading}
                error={errorListingProperties}
                components={{
                  Toolbar: PropertyToolbar,
                  NoRowsOverlay: getPropertiesEmptyState,
                  ErrorOverlay: getPropertyErrorState,
                  LoadingOverlay: getLoadingState,
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                  ...props,
                }}
                onRowClick={handlePropertyRowClick}
              />
            </Box>
          )}
        </Box>
      </>
    );
  }

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

  function PropertyToolbar(props: any) {
    return (
      <GridToolbarContainer
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <GridToolbarQuickFilter variant="outlined" size="small" />
        {!useMediaQuery(theme.breakpoints.down("sm")) ?
          <Button
          onClick={handleNewPropertyOpen}
          startIcon={<AddCircleOutlineOutlined />}
          variant="contained"
        >
          Create New Property
        </Button>
        :
        <IconButton onClick={handleNewPropertyOpen}>
          <AddCircleOutlineOutlined color='primary' fontSize='large' />
        </IconButton>
      }
      </GridToolbarContainer>
    );
  }

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
      <DialogTitle align="center">
        Select client for {props.type.slice(0, -1)}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress sx={{marginBottom: 2}} />}
        <Box sx={{ width: '100%' }}>
          <SelectStepper props={props} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          variant="outlined"
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogActions>
      <NewClient
        open={newClientOpen}
        onClose={handleCloseNewClient}
        update={handleSaveNewClient}
      />
      <EditProperty
        setProperty={setProperty}
        property={property}
        open={newPropertyOpen}
        onClose={handleCloseNewProperty}
        create={handleSaveNewProperty}
        type={'new'}
        token={process.env.REACT_APP_MAPBOX_TOKEN}
      />
    </Dialog>
  );
}
