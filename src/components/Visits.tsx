import { AddCircleOutlineOutlined, CalendarMonthOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Card, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers } from '../api/user.api';
import { listVisits } from '../api/visit.api';
import EditVisit from './EditVisit';


function Visits(props: any) {
    const [rows, setRows] = useState([] as any);
    const [open, setOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [visit, setVisit] = useState({} as any);
    const [type, setType] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [users, setUsers] = useState([] as any[]);
  
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, visit: any) => {
        setVisit(visit);
        setAnchorEl(event.currentTarget);
        setVisit({ ...visit, users: users.filter((user) => visit.users.some((obj: any) => obj.id === user.id))})
    };
    const closeMenu = () => {
      setAnchorEl(null);
    };

    const handleNewOpen = () => {
        setVisit({users: []});
        setType('new');
        setOpen(true);
    };

    const handleEditOpen = () => {
        setType('edit');
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };

    const handleUpdate = (value: string) => {
        setOpen(false);
        // save value
    };

    const handleCreate = (value: string) => {
        setOpen(false);
        // save value
    };

    useEffect(() => {
        listUsers()
        .then((result: any) => {
          setIsLoaded(true);
          setUsers(result);
        }, (err) => {
          setIsLoaded(true);
          setError(err.message)
        })
      }, [])

    useEffect(() => {
        listVisits(props.client)
        .then((result) => {
          setRows(result);
        }, (err) => {
        })
      }, [props])

    if (error) {
    return (<Typography>{error}</Typography>);
    }
    if (!isLoaded) {
    return (<Typography>Loading...</Typography>);
    }


    return (
        <Card>
            <Stack direction="row">
                <Typography>Visits</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
            </Stack>
            <List>
                {
                    rows.map((visit: any) => (
                        <ListItem key={visit.id}>
                                <Grid container spacing={2}>
                                    <Grid item={true} xs={2}>
                                        <CalendarMonthOutlined/>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <Stack>
                                            <Typography>{visit.name}</Typography>
                                            <Typography>{visit.address}</Typography>
                                            <Typography>{visit.date}</Typography>
                                            <Typography>{visit.users.map((user: any) => user.name).join(", ")}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item={true} xs={2}>
                                        <IconButton
                                        onClick={(e) => openMenu(e, visit)}
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
                                                <ListItemText>Edit Visit</ListItemText>
                                            </MenuItem>
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <DeleteOutline />
                                                </ListItemIcon>
                                                <ListItemText>Delete Visit</ListItemText>
                                            </MenuItem>
                                        </MenuList>
                                        </Menu>
                                    </Grid>
                                </Grid>
                        </ListItem>
                    ))
                }
            </List>
            <EditVisit
            visit={visit}
            setVisit={setVisit}
            open={open}
            onClose={handleClose}
            update={handleUpdate}
            create={handleCreate}
            type={type}
            users={users}
            />
        </Card>
    )
}

export default Visits;