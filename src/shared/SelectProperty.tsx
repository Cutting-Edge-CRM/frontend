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
  Stack,
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
import { createJob, updateJob } from '../api/job.api';
import { listProperties } from '../api/property.api';
import { createQuote, updateQuote } from '../api/quote.api';
import { theme } from '../theme/theme';
import CustomPagination from './CustomPagination';
import EmptyState from './EmptyState';
import EditProperty from './property/EditProperty';

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
  {
    field: 'state',
    headerName: 'State',
    headerClassName: 'MuiDataGrid-columnHeader',
    width: 170,
    sortable: false,
  },
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
          client: props.client,
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

  const handleCloseNewProperty = (value: string) => {
    console.log('closing');
    setNewPropertyOpen(false);
  };

  const handleSaveNewProperty = (value: string) => {
    setNewPropertyOpen(false);
    // save value
  };

  const handleNewPropertyOpen = () => {
    setNewPropertyOpen(true);
  };

  const getPropertiesEmptyState = () => {
    return <EmptyState type="properties" />;
  };

  useEffect(() => {
    setPropertyIsLoaded(false);
    listProperties(props.client).then(
      (result) => {
        setPropertyRows(result);
        setPropertyIsLoaded(true);
      },
      (err) => {
        setPropertyIsLoaded(true);
      }
    );
  }, [props.client, newPropertyOpen]);

  function PropertyToolbar(props: any) {
    return (
      <GridToolbarContainer>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <GridToolbarQuickFilter
            variant="outlined"
            size="small"
            sx={{ pb: 0 }}
          />
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
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
      <DialogTitle align="center">
        Select property for {props.type.slice(0, -1)}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Box sx={{ width: '100%' }}>
          {!propertyIsLoaded && <Box textAlign='center'><CircularProgress /></Box>}
          {propertyIsLoaded && (
            <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}, '& .MuiDataGrid-footerContainer': {display: 'none'}}}>
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
              disableColumnMenu
              onRowClick={handlePropertyRowClick}
            />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 1 }}>
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
        modalType={'new'}
        token={process.env.REACT_APP_MAPBOX_TOKEN}
        success={props.success}
        client={props.client}
      />
    </Dialog>
  );
}
