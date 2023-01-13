import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Card, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listNotes } from '../../api/note.api';
import EditNote from './EditNote';


function Notes(props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [rows, setRows] = useState([] as any);
    const [open, setOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [note, setNote] = useState({} as any);
    const [type, setType] = useState('');
  
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, note: any) => {
        setNote(note);
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
      setAnchorEl(null);
    };

    const handleNewOpen = () => {
        setNote({client: props.client});
        setType('new');
        setOpen(true);
    };

    const handleEditOpen = () => {
        setType('edit');
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setNote({client: props.client});
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
        listNotes(props.client)
        .then((result) => {
          setRows(result);
          setIsLoaded(true);
        }, (err) => {
            setIsLoaded(true);
            setError(err.message);
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
                <Typography>Notes</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
            </Stack>
            <List>
                {
                    rows.map((note: any) => (
                        <ListItem key={note.id}>
                                <Grid container spacing={2}>
                                    <Grid item={true} xs={10}>
                                        <Stack>
                                            <Typography>{note.title}</Typography>
                                            <Typography>{note.content}</Typography>
                                            <Typography>{note.date}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item={true} xs={2}>
                                        <IconButton
                                        onClick={(e) => openMenu(e, note)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                        <Menu
                                        id="note-menu"
                                        anchorEl={anchorEl}
                                        open={isOpen}
                                        onClose={closeMenu}
                                        >
                                        <MenuList>
                                            <MenuItem onClick={() => {handleEditOpen()}}>
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
                                        </Menu>
                                    </Grid>
                                </Grid>
                        </ListItem>
                    ))
                }
                {rows.length === 0 && <Typography>This client doesn't have any notes yet, click the "+" icon to add one.</Typography>}
            </List>
            <EditNote
            note={note}
            setNote={setNote}
            open={open}
            onClose={handleClose}
            update={handleUpdate}
            create={handleCreate}
            type={type}
            />
        </Card>
    )
}

export default Notes;