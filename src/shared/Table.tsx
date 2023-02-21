import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NewClient from './client/NewClient';
import SelectPropertyAndClient from './client/SelectPropertyAndClient';
import EmptyState from './EmptyState';
import CustomToolbar from './CutomToolbar';
import CustomPagination from './CustomPagination';
import SelectClient from './client/SelectClient';

export default function Table(props: any) {
  const navigate = useNavigate();
  const [newOpen, setNewOpen] = useState(false);

  const handleRowClick = (event: any) => {
    navigate(`/${props.type?.toLowerCase()}/${event.id}`);
  };

  const handleClose = () => {
    setNewOpen(false);
  };

  const handleNewOpen = () => {
    setNewOpen(true);
  };

  const getEmptyState = () => {
    return (
      <EmptyState
        type={`${props.client ? 'client-' : ''}${(
          props.type as string
        )?.toLowerCase()}`}
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
        <Typography>{props.errorListing}</Typography>
      </>
    );
  };

  const getLoadingState = () => {
    return <Box marginTop={3} textAlign='center'><CircularProgress /></Box>;
  };

  const handleFilterChange = (filterModel: any) => {
    props.setQuery(filterModel.quickFilterValues?.join(' '))
  }

  return (
    <Card>
      <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none !important'}}}>
      <DataGrid
        error={props.errorListing}
        loading={props.listLoading}
        autoHeight
        rows={props.rows}
        columns={props.columns}
        pagination
        page={props.page}
        disableColumnMenu
        pageSize={props.pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        rowCount={props.rowCount}
        onPageChange={(newPage) => props.setPage(newPage)}
        onPageSizeChange={(newPageSize) => props.setPageSize(newPageSize)}
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={handleFilterChange}
        rowHeight={props.mobile ? 100 : 52}
        headerHeight={props.mobile ? 0 : 52}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: getEmptyState,
          ErrorOverlay: getErrorState,
          LoadingOverlay: getLoadingState,
          Pagination: CustomPagination,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            handleNewOpen,
            title: props.title,
            type: props.type,
            onImportClick: props.onImportClick,
            handleExportClients: props.handleExportClients,
          },
          ...props,
        }}
        disableSelectionOnClick
        onRowClick={handleRowClick}
      />
      <NewClient
        open={props.type === 'Clients' && newOpen}
        onClose={handleClose}
        success={props.success}
      />
      <SelectPropertyAndClient
        open={
          (props.type === 'Quotes' ||
            props.type === 'Jobs') &&
          newOpen
        }
        onClose={handleClose}
        type={props.type}
        success={props.success}
      />
      <SelectClient
        open={
          (props.type === 'Invoices') &&
          newOpen
        }
        onClose={handleClose}
        success={props.success}
      />
      </Box>
    </Card>
  );
}
