import { AddCircleOutlineOutlined, CalendarMonthOutlined, CreateOutlined, DeleteOutline, MoreVert } from '@mui/icons-material';
import { Card, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React from 'react';
import EditVisit from './EditVisit';
import NewVisit from './NewVisit';

const visits = [{id: 1, title: "Appointment", address: "2202 7th St E", date: "Nov 28 - Dec 3", assigned: ["Parker", "Kim"]}, {id: 2, title: "Appointment", address: "2202 7th St E", date: "Nov 28 - Dec 3", assigned: ["Parker", "Kim"]}]


function Visits() {
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
                <Typography>Visits</Typography>
                <IconButton onClick={handleNewOpen}>
                    <AddCircleOutlineOutlined />
                </IconButton>
                <NewVisit
                    selectedValue={selectedValue}
                    open={newOpen}
                    onClose={handleNewClose}
                />
            </Stack>
            <List>
                {
                    visits.map(visit => (
                        <ListItem key={visit.id}>
                                <Grid container spacing={2}>
                                    <Grid item={true} xs={2}>
                                        <CalendarMonthOutlined/>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <Stack>
                                            <Typography>{visit.title}</Typography>
                                            <Typography>{visit.address}</Typography>
                                            <Typography>{visit.date}</Typography>
                                            <Typography>{visit.assigned}</Typography>
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
            selectedValue={selectedValue}
            open={editOpen}
            onClose={handleEditClose}
            />
        </Card>
    )
}

export default Visits;