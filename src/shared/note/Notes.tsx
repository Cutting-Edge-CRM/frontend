import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Alert, Card, CircularProgress, Grid, IconButton, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listNotes } from '../../api/note.api';
import ConfirmDelete from '../ConfirmDelete';
import EditNote from './EditNote';


function Notes(props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [rows, setRows] = useState([] as any);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [note, setNote] = useState({} as any);
    const [type, setType] = useState('');
    const [fileURLs, setFileURLs] = useState([] as {url: string, file: File}[]);
    const [originalImages, setOriginalImages] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
  
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, note: any, urls: any) => {
        setNote(note);
        setFileURLs(urls);
        setOriginalImages(urls);
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
      setAnchorEl(null);
    };

    const handleNewOpen = () => {
        setNote({client: props.client});
        setFileURLs([]);
        setType('new');
        setOpen(true);
    };

    const handleEditOpen = () => {
        setType('edit');
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setNote({client: props.client});
        setFileURLs([]);
        setOpen(false);
        closeMenu();
    };

    const handleUpdate = (value: string) => {
        setOpen(false);
        // save value
    };

    const handleCreate = (value: string) => {
        setOpen(false);
        // save value
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = (value: string) => {
        closeMenu();
        setDeleteOpen(false);
    };

    useEffect(() => {
        listNotes(props.client)
        .then((result) => {
          setRows(result);
          setLoading(false);
        }, (err) => {
            setLoading(false);
            setError(err.message);
        })
      }, [props, open, deleteOpen])

    const onDelete = () => {
        return;
    }

    return (
        <Card>
            <Stack direction="row">
                <Typography>Notes</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
            </Stack>
            {loading && (<CircularProgress />)}
            {error && (<Alert severity="error">{error}</Alert>)}
            {!loading && !error &&
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
                                                <ImageList cols={3}>
                                                {note.images.map((image: any) => (
                                                    <ImageListItem key={image.id}>
                                                        {/* eslint-disable-next-line */}
                                                        <img src={image.url}/>
                                                    </ImageListItem>
                                                    ))}
                                                </ImageList>
                                        </Stack>
                                    </Grid>
                                    <Grid item={true} xs={2}>
                                        <IconButton
                                        onClick={(e) => openMenu(e, note, note.images)}
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
                                            <MenuItem onClick={handleDeleteOpen}>
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
            </List>}
            <EditNote
            note={note}
            setNote={setNote}
            open={open}
            onClose={handleClose}
            update={handleUpdate}
            create={handleCreate}
            type={type}
            fileURLs={fileURLs}
            setFileURLs={setFileURLs}
            originalImages={originalImages}
            setOriginalImages={setOriginalImages}
            success={props.success}
            />
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'notes'}
            deleteId={note.id}
            onDelete={onDelete}
            success={props.success}
            />
        </Card>
    )
}

export default Notes;