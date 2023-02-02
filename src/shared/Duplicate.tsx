import { AddCircleOutlineOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listClients } from '../api/client.api';
import { createJob, updateJob } from '../api/job.api';
import { listProperties } from '../api/property.api';
import { createQuote, updateQuote } from '../api/quote.api';
import EmptyState from './EmptyState';
import EditProperty from './property/EditProperty';
import NewClient from './client/NewClient';
import CustomPagination from './CustomPagination';

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

export default function SelectClient(props: any) {
  const [client, setClient] = useState({} as any);
  const [property, setProperty] = useState({} as any);
  const [activeStep, setActiveStep] = useState(0);
  const [clientRows, setClientRows] = useState([]);
  const [propertyRows, setPropertyRows] = useState([]);
  const [clientIsLoaded, setClientIsLoaded] = useState(false);
  const [propertyIsLoaded, setPropertyIsLoaded] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newPropertyOpen, setNewPropertyOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      case 'Job':
        let job: any = {
          client: client.id,
          property: event.row.id,
          status: 'unscheduled',
        };
        createJob(job).then(
          (res) => {
            let updatingJob: any = {};
            updatingJob.job = job;
            updatingJob.job.id = res.id;
            updatingJob.items = props.job.items;
            updateJob(updatingJob).then(
              (_) => {
                setLoading(false);
                props.onClose();
                navigate(`/jobs/${res.id}`);
                props.success('Successfully duplicated job');
              },
              (err) => {
                setError(err.message);
                setLoading(false);
              }
            );
          },
          (err: any) => {
            setLoading(false);
            setError(err.message);
          }
        );

        break;
      case 'Quote':
        let quote: any = {
          client: client.id,
          property: event.row.id,
          status: 'draft',
        };
        createQuote(quote).then(
          (res) => {
            let updatingQuote: any = {};
            updatingQuote.quote = quote;
            updatingQuote.quote.id = res.id;
            updatingQuote.options = props.quote.options;
            updateQuote(updatingQuote).then(
              (_) => {
                setLoading(false);
                props.onClose();
                navigate(`/quotes/${res.id}`);
                props.success('Successfully duplicated quote');
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

  useEffect(() => {
    listClients().then(
      (result) => {
        setClientIsLoaded(true);
        setClientRows(result.rows);
      },
      (err) => {
        setClientIsLoaded(true);
      }
    );
  }, [newClientOpen]);

  useEffect(() => {
    setPropertyIsLoaded(false);
    if (!client) return;
    listProperties(client.id).then(
      (result) => {
        setPropertyRows(result);
        setPropertyIsLoaded(true);
      },
      (err) => {
        setPropertyIsLoaded(true);
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
            <Box>
              {!clientIsLoaded && <Box textAlign='center'><CircularProgress /></Box>}
              {clientIsLoaded && (
                <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}}}>
                <DataGrid
                  autoHeight
                  rows={clientRows}
                  columns={clientColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  components={{
                    Toolbar: ClientToolbar,
                    NoRowsOverlay: getClientEmptyState,
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
              )}
            </Box>
          ) : (
            <Box>
              {!propertyIsLoaded && <Box textAlign='center'><CircularProgress /></Box>}
              {propertyIsLoaded && (
                <DataGrid
                  autoHeight
                  rows={propertyRows}
                  columns={propertyColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  components={{
                    Toolbar: PropertyToolbar,
                    NoRowsOverlay: getPropertiesEmptyState,
                    Pagination: CustomPagination,
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
              )}
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
        <Button
          onClick={handleNewClientOpen}
          startIcon={<AddCircleOutlineOutlined />}
          variant="contained"
        >
          Create New Client
        </Button>
      </GridToolbarContainer>
    );
  }

  function PropertyToolbar(props: any) {
    return (
      <GridToolbarContainer
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <GridToolbarQuickFilter variant="outlined" size="small" />
        <Button
          onClick={handleNewPropertyOpen}
          startIcon={<AddCircleOutlineOutlined />}
          variant="contained"
        >
          Create New Property
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Dialog onClose={handleCancel} open={props.open} fullWidth>
      <DialogTitle align="center">Select client for {props.type}</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Box sx={{ width: '100%' }}>
          {(props.type === 'Quote' || props.type === 'Job') && (
            <SelectStepper props={props} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
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
        success={props.success}
      />
      <EditProperty
        setProperty={setProperty}
        property={property}
        open={newPropertyOpen}
        onClose={handleCloseNewProperty}
        create={handleSaveNewProperty}
        type={'new'}
        token={mapboxgl.accessToken}
        success={props.success}
      />
    </Dialog>
  );
}
