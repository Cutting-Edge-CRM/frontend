import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Card, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React from 'react';
import EditNote from './EditNote';
import NewNote from './NewNote';

const notes = [{id: 1, title: "Appointment", content: "Lorem ipsum ergo", date: "Nov 28 - Dec 3"}, {id: 2, title: "Appointment", address: "Lorem ipsum ergo", date: "Nov 28 - Dec 3"}]


function Notes() {
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

    return (
        <Card>
            <Stack direction="row">
                <Typography>Notes</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
                <NewNote
                    selectedValue={selectedValue}
                    open={newOpen}
                    onClose={handleNewClose}
                />
            </Stack>
            <List>
                {
                    notes.map(note => (
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
            </List>
            <EditNote
            selectedValue={selectedValue}
            open={editOpen}
            onClose={handleEditClose}
            />
        </Card>
    )
}

export default Notes;