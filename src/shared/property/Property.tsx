import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { getProperty } from '../../api/property.api';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';
const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

function Property(props: any) {
  const [rows, setRows] = useState([] as any);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState([] as any);

  const columns: GridColDef[] = [
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
      width: 150,
    },
    {
      field: 'zip',
      headerName: 'Postal',
      width: 150,
    },
  ];

  useEffect(() => {
    const marker = new mapboxgl.Marker();
    try {
      if (coords.length > 0) {
        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coords as [number, number],
            zoom: 12,
          });
          marker.setLngLat(coords as [number, number]).addTo(map.current);
        } else {
          map.current.setCenter(coords as [number, number]);
          marker.setLngLat(coords as [number, number]).addTo(map.current);
        }
      }
    } catch (err: any) {
      console.error(err);
      setMapError(err.message);
    }
  }, [coords]);

  useEffect(() => {
    getProperty(props.property).then(
      (result) => {
        setIsLoaded(true);
        setRows([result]);
        getCoords(result);
      },
      (err) => {
        setIsLoaded(true);
        setError(err.message);
      }
    );
  }, [props]);

  function getCoords(address: any) {
    let query = [
      address.address,
      address.address2,
      address.city,
      address.state,
      address.zip,
      address.country,
    ].join(' ');
    geocodingClient
      .forwardGeocode({
        query: query,
        autocomplete: false,
        limit: 1,
      })
      .send()
      .then((response) => {
        if (!response?.body?.features?.length) {
          setCoords([]);
          return;
        }
        const feature = response.body.features[0];
        setCoords(feature.center);
      });
  }

  return (
    <Card sx={{ pb: 2.5 }}>
      <CardHeader title="Property" />
      <Box>
        {mapError && <Typography>{mapError}</Typography>}
        {!mapError && (
          <div
            style={{
              height: coords.length > 0 ? 290 : 0,
              borderRadius: '15px',
            }}
            ref={mapContainer}
            className="map-container"
          />
        )}
      </Box>
      <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell:focus-within': {outline: 'none'}}}>
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoaded && <Box textAlign='center'><CircularProgress /></Box>}
        {!error && isLoaded && (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            hideFooter
            rowHeight={70}
          />
        )}
      </Box>
    </Card>
  );
}

export default Property;
