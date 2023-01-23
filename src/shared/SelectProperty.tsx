import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, updateJob } from '../api/job.api';
import { listProperties } from '../api/property.api';
import { createQuote, updateQuote } from '../api/quote.api';
import EmptyState from './EmptyState';
import EditProperty from './property/EditProperty';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';


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

export default function SelectProperty(props: any) {
    const [property, setProperty] = useState({} as any);
    const [propertyRows, setPropertyRows] = useState([]);
    const [propertyIsLoaded, setPropertyIsLoaded] = useState(false);
    const [newPropertyOpen, setNewPropertyOpen] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        props.onClose();
      };
    
    const handlePropertyRowClick = (event: any) => {
      setLoading(true);
      setProperty(event.row);
      switch (props.type) {
        case 'Jobs':
          let job: any = {
            client: props.client,
            property: event.row.id,
            status: 'unscheduled',
          };
          createJob(job)
          .then(res => {
            let updatingJob: any = {};
            updatingJob.job = job;
            updatingJob.job.id = res.id;
            updatingJob.items = [{job: res.id, price: 0}]
            updateJob(updatingJob)
            .then(_ => {
              setLoading(false);
              navigate(`/jobs/${res.id}`);
              props.success('Successfully created new job');
            }, err => {
              setLoading(false);
              setError(err.message);
            })
          }, (err: any) => {
            setLoading(false);
            setError(err.message);
          })
          
          break;
        case 'Quotes':
          let quote: any = {
            client: props.client,
            property: event.row.id,
            status: 'draft',
          };
          createQuote(quote)
          .then(res => {
            let updatingQuote: any = {};
            updatingQuote.quote = quote;
            updatingQuote.quote.id = res.id;
            updatingQuote.options = [{
              quote: res.id,
              deposit: 0,
              depositPercent: 0,
              tax: null,
              items: [{quote: res.id, price: 0}]
            }]
            updateQuote(updatingQuote)
            .then(_ => {
              setLoading(false);
              navigate(`/quotes/${res.id}`);
              props.success('Successfully created new quote');
            }, err => {
              setLoading(false);
              setError(err.message);
            })
          }, err => {
            setLoading(false);
            setError(err.message);
          })
          break;
        default:
          break;
      }

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

    const getPropertiesEmptyState = () => {
      return (<EmptyState type='properties'/>);
    }


      useEffect(() => {
        setPropertyIsLoaded(false);
        listProperties(props.client)
        .then((result) => {
          setPropertyRows(result)
          setPropertyIsLoaded(true);
        }, (err) => {
            setPropertyIsLoaded(true);
        })
      }, [props.client, newPropertyOpen])


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
        <DialogTitle>Select property for {props.type.slice(0,-1)}</DialogTitle>
        <DialogContent>
        {loading && <LinearProgress />}
        <Box sx={{ width: '100%' }}>
          {!propertyIsLoaded && <CircularProgress />}
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
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={handleCancel}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogActions>
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
  