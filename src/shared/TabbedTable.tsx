import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { ImportExport, FileDownloadOutlined, FileUploadOutlined, AddCircleOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NewClient from './client/NewClient';
import SelectClient from './client/SelectClient';
import EmptyState from './EmptyState';


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

  function CustomToolbar() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
      setAnchorEl(null);
    };

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
        { props.type === 'Clients' &&
              <><Button
                startIcon={<ImportExport />}
                onClick={openMenu}
              >
                Import/Export
              </Button><Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
              >
                  <MenuList>
                    <MenuItem onClick={props.onImportClick}>
                      <ListItemIcon>
                        <FileDownloadOutlined />
                      </ListItemIcon>
                      <ListItemText>Import</ListItemText>
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <FileUploadOutlined />
                      </ListItemIcon>
                      <ListItemText>Export</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Menu></>
          }
        <Button onClick={handleNewOpen} startIcon={<AddCircleOutlineOutlined />}>New {props.type.slice(0,-1)}</Button>
        </>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <DataGrid
      autoHeight
      rows={props.rows}
      columns={props.columns}
      components={{ Toolbar: CustomToolbar , NoRowsOverlay: getEmptyState}}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        }, ...props
      }}
      disableSelectionOnClick
      onRowClick={handleRowClick}
    />
        <NewClient
      open={ props.type === 'Clients' && newOpen}
      onClose={handleClose}
        />
        <SelectClient
        open={ (props.type === 'Quotes' || props.type === 'Jobs' || props.type === 'Invoices') && newOpen}
        onClose={handleClose}
        update={handleUpdate}
        type={props.type}
        />
      </Box>
  );
}