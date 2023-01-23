import { AddCircleOutlineOutlined, CalendarMonthOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Alert, Card, CircularProgress, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listUsers } from '../../api/user.api';
import { listVisits } from '../../api/visit.api';
import EditVisit from './EditVisit';
import dayjs from 'dayjs';
import ConfirmDelete from '../ConfirmDelete';


function Visits(props: any) {
    const [rows, setRows] = useState([] as any);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visit, setVisit] = useState({} as any);
    const [type, setType] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [users, setUsers] = useState([] as any[]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
  
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, visit: any) => {
        setStartTime(visit.start?.split(' ')[1]);
        setEndTime(visit.end?.split(' ')[1]);
        setVisit(visit);
        setAnchorEl(event.currentTarget);
        setVisit({ ...visit, users: users.filter((user) => visit.users.some((obj: any) => obj.id === user.id))})
    };
    const closeMenu = () => {
      setAnchorEl(null);
    };

    const handleNewOpen = () => {
        setVisit({users: [], property: null, anytime: true});
        setType('new');
        setOpen(true);
    };

    const handleEditOpen = () => {
        setType('edit');
        setOpen(true);
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };

    const handleDeleteClose = (value: string) => {
        closeMenu();
        setDeleteOpen(false);
    };

    const handleUpdate = (value: string) => {
        setOpen(false);
        // save value
    };

    const handleCreate = (value: string) => {
        setOpen(false);
        // save value
    };

    const onDelete = () => {
        return;
    }

    useEffect(() => {
        listUsers()
        .then((result: any) => {
          setUsers(result);
        }, (err) => {
          setError(err.message)
        })
      }, [])

    useEffect(() => {
        listVisits(props.client)
        .then((result) => {
            setLoading(false);
            result = result.map((re: any) => {
                return {
                    ...re,
                    start: dayjs(re.start).format('YYYY-MM-DD HH:mm'),
                    end: dayjs(re.end).format('YYYY-MM-DD HH:mm')
                }
            })
          setRows(result);
        }, (err) => {
            setLoading(false);
            setError(err.message)
        })
      }, [props, open, deleteOpen])

    return (
        <Card>
            <Stack direction="row">
                <Typography>Visits</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
            </Stack>
            {loading && (<CircularProgress />)}
            {error && (<Alert severity="error">{error}</Alert>)}
            {!loading && !error &&
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
                                            
                                            {dayjs(visit.start).diff(dayjs(visit.end), 'hours') < 24 && dayjs(visit.start).diff(dayjs(visit.end), 'hours') > -24 ?

                                            // if start and end within 1 day of eachother
                                            (visit.anytime === (1 || true) ? 
                                                // if anytime: Jan 13
                                                <Typography>{dayjs(visit.start).format('MMM D')} - Anytime</Typography>
                                                : 
                                                // if not anytime: Jan 13 4:30pm - 6:00pm
                                                <Typography>{dayjs(visit.start).format('MMM D')}  {dayjs(visit.start).format('h:mma')} - {dayjs(visit.end).format('h:mma')}</Typography>)
                                            
                                            // if start and end not within 1 day of eachother: Jan 13 - Jan 16
                                            :
                                            <Typography>{dayjs(visit.start).format('MMM D')} - {dayjs(visit.end).format('MMM D')}</Typography>
                                            }
                                            <Typography>{visit.users.map((user: any) => user.name ? user.name : user.email).join(", ")}</Typography>
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
                                            <MenuItem onClick={handleDeleteOpen}>
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
                {rows.length === 0 && <Typography>This client doesn't have any visits yet, click the "+" icon to add one.</Typography>}
            </List>}
            <EditVisit
            visit={visit}
            setVisit={setVisit}
            open={open}
            onClose={handleClose}
            update={handleUpdate}
            create={handleCreate}
            type={type}
            users={users}
            client={props.client}
            startTime={startTime}
            endTime={endTime}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            success={props.success}
            />
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'visits'}
            deleteId={visit.id}
            onDelete={onDelete}
            success={props.success}
            />
        </Card>
    )
}

export default Visits;