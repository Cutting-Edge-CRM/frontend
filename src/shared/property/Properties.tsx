import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import mapboxgl from 'mapbox-gl';
import EditProperty from './EditProperty';
import { listProperties } from '../../api/property.api';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import EmptyState from '../EmptyState';
import ConfirmDelete from '../ConfirmDelete';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';
const geocodingClient = mbxGeocoding({accessToken: mapboxgl.accessToken});
  
function Properties(props: any) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [rows, setRows] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
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
        getCoords(event.row)
      }

    const getEmptyState = () => {
        return (<EmptyState type='properties'/>);
    }

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
        }];

        if (props.type === 'client') {
            columns.push(
                {
                    field: 'options',
                    headerName: '',
                    width: 150,
                    renderCell: (params: GridRenderCellParams<string>) => {    
                        return (
                            <>
                            <IconButton
                                onClick={(e) => openMenu(e, params.row)}
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
                            </Menu></>
                        );
                    },
                }
            );
        }

    useEffect(() => {
        const marker = new mapboxgl.Marker();
        try {
            if (coords.length > 0) {
                if (!map.current) {
                    map.current = new mapboxgl.Map({
                        container: mapContainer.current as HTMLDivElement,
                        style: 'mapbox://styles/mapbox/streets-v12',
                        center: coords as [number, number],
                        zoom: 12
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
      listProperties(props.client)
      .then((result) => {
        setIsLoaded(true);
        setRows(result);
        if (result[0]) getCoords(result[0]);
      }, (err) => {
        setIsLoaded(true);
        setError(err.message)
      })
    }, [props, open, deleteOpen])

    function getCoords(address: any) {
        let query =  [address.address, address.address2, address.city, address.state, address.zip, address.country].join(" ");
        geocodingClient
        .forwardGeocode({
            query: query,
            autocomplete: false,
            limit: 1
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

    const onDelete = () => {
        return;
    }
    

    return (
        <Card>
            <Box>
                <Typography>{props.type === 'client' ? 'Properties' : 'Property'}</Typography>
                {props.type === 'client' && 
                <>
                <Button onClick={handleNewOpen} startIcon={<AddCircleOutlineOutlined />}>New Property</Button>
                </>
                }
            </Box>
            <Box>
                {mapError && <Typography>{mapError}</Typography>}
                {!mapError && <div style={{height: coords.length > 0 ? 290 : 0}} ref={mapContainer} className="map-container" />}
            </Box>
            <Box>
                {error && <Typography>{error}</Typography>}
                {!isLoaded && <Typography>Loading...</Typography>}
                {!error && isLoaded && 
                <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                onRowClick={handleRowClick}
                components={{NoRowsOverlay: getEmptyState}}
                />}
                
            </Box>
            
            <EditProperty
            property={property}
            setProperty={setProperty}
            open={open}
            onClose={handleClose}
            update={handleUpdate}
            create={handleCreate}
            modalType={modalType}
            token={mapboxgl.accessToken}
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
    )
}

export default Properties;