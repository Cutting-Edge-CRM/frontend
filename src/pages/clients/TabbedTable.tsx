import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button, CircularProgress, Divider, Typography } from '@mui/material';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EmptyState from '../../shared/EmptyState';
import SelectProperty from '../../shared/SelectProperty';


export default function Table(props: any) {
  const navigate = useNavigate();
  const [newOpen, setNewOpen] = useState(false);
  

  const handleRowClick = (event: any) => {
    navigate(`/${props.type}/${event.id}`)
  }

  const handleClose = (value: string) => {
      setNewOpen(false);
  };

  const handleUpdate = (value: string) => {
    setNewOpen(false);
      // save value
  };

  const handleNewOpen = () => {
    setNewOpen(true);
  }

  const getEmptyState = () => {
    return (<EmptyState type={`${props.client ? 'client-': ''}${(props.type as string)?.toLowerCase()}`}/>);
  }

  const getErrorState = () => {
    return (
    <><CustomToolbar /><Typography>{props.errorListing}</Typography></>
    );
  }

  const getLoadingState = () => {
    return (<CircularProgress />);
  }

  function CustomToolbar() {

    return (
      <GridToolbarContainer>
        <Box>
          <Typography>
          {props.title}
          </Typography>
        </Box>
        <Divider variant="middle" />
        <Box>
          <>
          <GridToolbarQuickFilter />
        <Button onClick={handleNewOpen} startIcon={<AddCircleOutlineOutlined />}>New {props.type.slice(0,-1)}</Button>
        </>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <DataGrid
      error={props.errorListing}
      loading={props.loadingList}
      autoHeight
      rows={props.rows}
      columns={props.columns}
      components={{ Toolbar: CustomToolbar , NoRowsOverlay: getEmptyState, ErrorOverlay: getErrorState, LoadingOverlay: getLoadingState}}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        }, ...props
      }}
      disableSelectionOnClick
      onRowClick={handleRowClick}
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