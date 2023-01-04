import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { ImportExport, FileDownloadOutlined, FileUploadOutlined, AddCircleOutlineOutlined } from '@mui/icons-material';


export default function Table(props: any) {

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
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={openMenu}
              >
                Import/Export
              </Button><Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
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
        <Button startIcon={<AddCircleOutlineOutlined />}>New {props.type.slice(0,-1)}</Button>
        </>
        </Box>
      </GridToolbarContainer>
    );
  }


  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}