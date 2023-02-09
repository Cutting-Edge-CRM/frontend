import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  BoxProps,
  Button,
  Card,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  styled,
  Typography,
} from '@mui/material';
import {
  AddCircleOutlineOutlined,
  CreateOutlined,
  DeleteOutline,
  MoreVert,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import EditProperty from './EditProperty';
import { listProperties } from '../../api/property.api';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import EmptyState from '../EmptyState';
import ConfirmDelete from '../ConfirmDelete';
import { currentUserClaims } from '../../auth/firebase';

const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

const CardHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

function Properties(props: any) {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState([] as any);
  const [property, setProperty] = useState({} as any);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    setProperty(row);
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleNewOpen = () => {
    setProperty({});
    setModalType('new');
    setOpen(true);
  };

  const handleEditOpen = () => {
    setModalType('edit');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    setOpen(false);
  };

  const handleCreate = (res: any) => {
    // set selected property
    setOpen(false);
  };

  const handleRowClick = (event: any) => {
    setMapError(null);
    getCoords(event.row);
  };

  const getEmptyState = () => {
    return <EmptyState type="properties" />;
  };

  const getErrorState = () => {
    return <Alert severity="error">{error}</Alert>;
  };

  const getLoadingState = () => {
    return <Box textAlign='center'><CircularProgress /></Box>;
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
    closeMenu();
  };

  const columns: GridColDef[] = [
    {
      field: 'address',
      headerName: 'Address',
      headerClassName: 'MuiDataGrid-columnHeader',
      width: 200,
      sortable: false,
    },
    {
      field: 'city',
      headerName: 'City',
      headerClassName: 'MuiDataGrid-columnHeader',
      width: 170,
      sortable: false,
    },
    {
      field: 'state',
      headerName: 'State',
      headerClassName: 'MuiDataGrid-columnHeader',
      width: 170,
      sortable: false,
    },
    {
      field: 'zip',
      headerName: 'Postal',
      headerClassName: 'MuiDataGrid-columnHeader',
      width: 170,
      sortable: false,
    },
  ];

  if (props.type === 'client') {
    columns.push({
      field: 'options',
      headerName: '',
      width: 50,
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <>
          {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
            <IconButton onClick={(e) => openMenu(e, params.row)}>
              <MoreVert color="primary" />
            </IconButton>
            }
            <Menu
              id="visit-menu"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={closeMenu}
            >
              <MenuList>
                <MenuItem onClick={handleEditOpen}>
                  <ListItemIcon>
                    <CreateOutlined />
                  </ListItemIcon>
                  <ListItemText>Edit Property</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteOpen}>
                  <ListItemIcon>
                    <DeleteOutline />
                  </ListItemIcon>
                  <ListItemText>Delete Property</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        );
      },
    });
  }

  useEffect(() => {
    const marker = new mapboxgl.Marker();
    try {
      if (coords.length > 0 && !mapError) {
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
  }, [coords, mapError]);

  useEffect(() => {
    listProperties(props.client).then(
      (result) => {
        setLoading(false);
        setRows(result);
        if (result[0]) getCoords(result[0]);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  }, [props, open, deleteOpen]);

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
        if (feature.relevance > 0.7) {
          setCoords(feature.center);
        } else {
          setMapError('Not found' as any);
          map.current = null;
        }
      });
  }

  const onDelete = () => {
    return;
  };

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" fontWeight={600}>
          {props.type === 'client' ? 'Properties' : 'Property'}
        </Typography>
        {props.type === 'client' && (
          <>
          {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewOpen}
              startIcon={<AddCircleOutlineOutlined />}
            >
              New Property
            </Button>
          }
          </>
        )}
      </CardHeader>
      <Box>
        {mapError && (
          <Typography>Map not available for this property</Typography>
        )}
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
      <Box sx={{'& .MuiDataGrid-row': {cursor: 'pointer'}, '& .MuiDataGrid-cell': {outline: 'none !important'}}}>
        <DataGrid
          error={error}
          loading={loading}
          autoHeight
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          components={{
            NoRowsOverlay: getEmptyState,
            ErrorOverlay: getErrorState,
            LoadingOverlay: getLoadingState,
          }}
          hideFooter
          rowHeight={70}
          disableColumnMenu
        />
      </Box>

      <EditProperty
        property={property}
        setProperty={setProperty}
        open={open}
        onClose={handleClose}
        update={handleUpdate}
        create={handleCreate}
        modalType={modalType}
        token={process.env.REACT_APP_MAPBOX_TOKEN}
        success={props.success}
        {...props}
      />
      <ConfirmDelete
        open={deleteOpen}
        onClose={handleDeleteClose}
        type={'properties'}
        deleteId={property.id}
        onDelete={onDelete}
        success={props.success}
      />
    </Card>
  );
}

export default Properties;
