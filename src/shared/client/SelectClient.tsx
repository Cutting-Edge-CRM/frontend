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
import { createInvoice, updateInvoice } from '../../api/invoice.api';
import { theme } from '../../theme/theme';
import CustomPagination from '../CustomPagination';
import EmptyState from '../EmptyState';
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


export default function SelectClient(props: any) {
  const [clientRows, setClientRows] = useState([]);
  const [clientsAreLoading, setClientsAreLoading] = useState(false);
  const [errorListingClients, setErrorListingClients] = useState(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = () => {
    props.onClose();
  };

  const handleClientRowClick = (event: any) => {
    setLoading(true);
    let invoice: any = {
        client: event.row.id,
        status: 'Draft',
      };
      createInvoice(invoice).then(
        (res) => {
          let updatingInvoice: any = {};
          updatingInvoice.invoice = invoice;
          updatingInvoice.invoice.id = res.id;
          updatingInvoice.items = [{ invoice: res.id, price: 0 }];
          updateInvoice(updatingInvoice).then(
            (_) => {
              setLoading(false);
              navigate(`/invoices/${res.id}`);
              props.onClose();
              props.success('Successfully created new invoice');
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


  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
      <IconButton sx={{ justifyContent: 'start' }} onClick={handleCancel} disableRipple>
        <Close fontSize='large'/>
      </IconButton>
      <DialogTitle align="center">
        Select client for Invoice
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Box sx={{ width: '100%', mt: 2, '& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'} }}>
            <DataGrid
                autoHeight
                rows={clientRows}
                columns={clientColumns}
                pageSize={10}
                disableColumnMenu
                rowsPerPageOptions={[10, 20, 50]}
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          sx={{ mr: 1 }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogActions>
      <NewClient
        open={newClientOpen}
        onClose={handleCloseNewClient}
        update={handleSaveNewClient}
      />
    </Dialog>
  );
}
