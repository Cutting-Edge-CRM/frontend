import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, IconButton, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, MoreVert } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

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
                <IconButton>
                    <MoreVert />
                </IconButton>
            );
          },
    }
  ];
  
  const rows = [
    { id: 1, address: "Name" , city: 'Snow', state: 'Jon', zip: 35 },
    { id: 2, address: "Name" , city: 'Lannister', state: 'Cersei', zip: 42 },
    { id: 3, address: "Name" , city: 'Lannister', state: 'Jaime', zip: 45 },
  ];

function Properties() {
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
                <Button startIcon={<AddCircleOutlineOutlined />}>New Property</Button>
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
        </Card>
    )
}

export default Properties;