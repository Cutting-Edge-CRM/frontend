import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EmptyState from '../../shared/EmptyState';
import SelectProperty from '../../shared/SelectProperty';
import CustomToolbar from '../../shared/CutomToolbar';
import CustomPagination from '../../shared/CustomPagination';

export default function Table(props: any) {
  const navigate = useNavigate();
  const [newOpen, setNewOpen] = useState(false);

  const handleRowClick = (event: any) => {
    navigate(`/${props.type}/${event.id}`);
  };

  const handleClose = (value: string) => {
    setNewOpen(false);
  };

  const handleUpdate = (value: string) => {
    setNewOpen(false);
    // save value
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
        <CustomToolbar type={props.type} handleNewOpen={handleNewOpen} />
        <Typography>{props.errorListing}</Typography>
      </>
    );
  };

  const getLoadingState = () => {
    return <CircularProgress />;
  };

  return (
    <Box>
      <DataGrid
        error={props.errorListing}
        loading={props.loadingList}
        autoHeight
        rows={props.rows}
        columns={props.columns}
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
            type: props.type,
            handleNewOpen,
          },
          ...props,
        }}
        disableSelectionOnClick
        onRowClick={handleRowClick}
        rowHeight={72}
        disableColumnMenu
      />
      <SelectProperty
        client={props.client}
        open={newOpen}
        onClose={handleClose}
        update={handleUpdate}
        type={props.type}
        success={props.success}
      />
    </Box>
  );
}
