import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { listClients } from '../../api/client.api';
import { listProperties } from '../../api/property.api';
import EmptyState from '../EmptyState';
import EditProperty from '../property/EditProperty';
import NewClient from './NewClient';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

const clientColumns: GridColDef[] = [
    { 
        field: 'name',
        headerName: 'Name',
        width: 150 },
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
        width: 150 },
    {
    field: 'city',
    headerName: 'City',
    width: 150,
    }
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

    const handleCancel = () => {
        props.onClose();
      };

    const handleSave = () => {
        props.create(client, property);
      };

    const handleNext = () => {  
        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setPropertyRows([]);
        setPropertyIsLoaded(false);
        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
      };

    const handleClientRowClick = (event: any) => {
        setClient(event.row);
        setActiveStep(1);
    }

    const handlePropertyRowClick = (event: any) => {
        setProperty(event.row)
    }

    const handleCloseNewClient = (value: string) => {
        setNewClientOpen(false);
    };
  
    const handleSaveNewClient = (value: string) => {
        setNewClientOpen(false);
        // save value
    };
  
    const handleNewClientOpen = () => {
        setNewClientOpen(true);
    }

    const handleCloseNewProperty = (value: string) => {
        setNewPropertyOpen(false);
    };
  
    const handleSaveNewProperty = (value: string) => {
        setNewPropertyOpen(false);
        // save value
    };
  
    const handleNewPropertyOpen = () => {
        setNewPropertyOpen(true);
    }

    const getClientEmptyState = () => {
      return (<EmptyState type='clients'/>);
    }

    const getPropertiesEmptyState = () => {
      return (<EmptyState type='properties'/>);
    }

      useEffect(() => {
        listClients()
        .then((result) => {
          setClientIsLoaded(true);
          setClientRows(result)
        }, (err) => {
            setClientIsLoaded(true);
        })
      }, [])

      useEffect(() => {
        if (!client) return;
        listProperties(client.id)
        .then((result) => {
          setPropertyRows(result)
          setPropertyIsLoaded(true);
        }, (err) => {
            setPropertyIsLoaded(true);
        })
      }, [client])

      function SelectStepper(props: any) {
        return (<><Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Select Client</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select Property</StepLabel>
          </Step>
        </Stepper><React.Fragment>
            {activeStep === 0 ? (
              <Box>
                {!clientIsLoaded && <Typography>Loading</Typography>}
                {clientIsLoaded &&
                  <DataGrid
                    autoHeight
                    rows={clientRows}
                    columns={clientColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    components={{ Toolbar: ClientToolbar, NoRowsOverlay: getClientEmptyState }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      }, ...props
                    }}
                    onRowClick={handleClientRowClick} />}
              </Box>
            ) : (
              <Box>
                {!propertyIsLoaded && <Typography>Loading</Typography>}
                {propertyIsLoaded &&
                  <DataGrid
                  autoHeight
                    rows={propertyRows}
                    columns={propertyColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    components={{ Toolbar: PropertyToolbar, NoRowsOverlay: getPropertiesEmptyState }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      }, ...props
                    }}
                    onRowClick={handlePropertyRowClick} />}

              </Box>
            )}
          </React.Fragment></>);
      }

      function ClientToolbar(props: any) {
        return (
          <GridToolbarContainer>
              <GridToolbarQuickFilter />
              <Button onClick={handleNewClientOpen} startIcon={<AddCircleOutlineOutlined />}>Create New Client</Button>
          </GridToolbarContainer>
        );
      }

    function PropertyToolbar(props: any) {
        return (
          <GridToolbarContainer>
              <GridToolbarQuickFilter />
              <Button onClick={handleNewPropertyOpen} startIcon={<AddCircleOutlineOutlined />}>Create New Property</Button>
          </GridToolbarContainer>
        );
      }

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Select client for {props.type.slice(0,-1)}</DialogTitle>
        <DialogContent>
        <Box sx={{ width: '100%' }}>
          {(props.type === 'Quotes' || props.type === 'Jobs') && <SelectStepper props={props}/>}
          {props.type === 'Invoices' &&
          <Box sx={{ height: 400, width: '100%' }}>
                {!clientIsLoaded && <Typography>Loading</Typography>}
                {clientIsLoaded &&
                  <DataGrid
                    rows={clientRows}
                    columns={clientColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    components={{ Toolbar: ClientToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      }, ...props
                    }}
                    onRowClick={handleClientRowClick} />}
            </Box>}
        </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === 1 ? (
            <Button
              onClick={handleSave}>
              Create
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={false}>
              Next
            </Button>
          )}
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
            token={mapboxgl.accessToken}
        />
      </Dialog>
    );
  }
  