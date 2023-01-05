import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import NewProperty from './NewProperty';
import EditProperty from './EditProperty';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';
  
  const rows = [
    { id: 1, address: "Name" , city: 'Snow', state: 'Jon', zip: 35 },
    { id: 2, address: "Name" , city: 'Lannister', state: 'Cersei', zip: 42 },
    { id: 3, address: "Name" , city: 'Lannister', state: 'Jaime', zip: 45 },
  ];

function Properties() {
    const [newOpen, setNewOpen] = React.useState(false);
const [editOpen, setEditOpen] = React.useState(false);
const [selectedValue, setSelectedValue] = React.useState("");
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const isOpen = Boolean(anchorEl);

const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorEl(event.currentTarget);
};
const closeMenu = () => {
  setAnchorEl(null);
};

const handleNewOpen = () => {
    setNewOpen(true);
};

const handleNewClose = (value: string) => {
  setNewOpen(false);
  setSelectedValue(value);
};

const handleEditOpen = () => {
    // set state to pass into modal
    setEditOpen(true);
};

const handleEditClose = (value: string) => {
  setEditOpen(false);
  setSelectedValue(value);
};


const columns: GridColDef[] = [
    { 
        field: 'address',
        headerName: 'Address',
        width: 150 },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
    },
    {
      field: 'state',
      headerName: 'State',
      width: 150,
    },
    {
      field: 'zip',
      headerName: 'Postal',
      width: 150,
    },
    {
        field: 'options',
        headerName: '',
        width: 150,
        renderCell: (params: GridRenderCellParams<string>) => {    
            return (
                <>
                <IconButton
                    onClick={openMenu}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="visit-menu"
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={closeMenu}
                >
                    <MenuList>
                        <MenuItem onClick={() => { handleEditOpen(); } }>
                            <ListItemIcon>
                                <CreateOutlined />
                            </ListItemIcon>
                            <ListItemText>Edit Note</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <DeleteOutline />
                            </ListItemIcon>
                            <ListItemText>Delete Note</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu></>
            );
          },
    }
  ];
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng] = useState(-70.9);
    const [lat] = useState(42.35);
    const [zoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
    });

    return (
        <Card sx={{ height: 650}}>
            <Box>
                <Typography>Properties</Typography>
                <Button onClick={handleNewOpen} startIcon={<AddCircleOutlineOutlined />}>New Property</Button>
                <NewProperty
                    selectedValue={selectedValue}
                    open={newOpen}
                    onClose={handleNewClose}
                />
            </Box>
            <Box>
            <div style={{height: 290}} ref={mapContainer} className="map-container" />
            </Box>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <DataGrid
                rows={rows}
                columns={columns}
                />
            </Box>
            <EditProperty
            selectedValue={selectedValue}
            open={editOpen}
            onClose={handleEditClose}
            />
        </Card>
    )
}

export default Properties;