import { AddCircleOutlineOutlined, CreateOutlined, DeleteOutline, MoreVert, PersonOutline } from '@mui/icons-material';
import { Button, Card, Chip, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateJob } from '../api/job.api';
import ConfirmDelete from './ConfirmDelete';
import EmptyState from './EmptyState';
import RichText from './RichText';

function add(accumulator: number, a: number) {
    return (+accumulator) + (+a);
  }

function JobItemSaved(props: any) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Service</Typography>
                        <Typography>{props.item.title}</Typography>
                    </Stack>
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <Typography>Total</Typography>
                        <Typography>${props.item.price}</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <Divider/>
                <Typography dangerouslySetInnerHTML={{__html: props.item.description}}></Typography>
            </Stack>
            <Divider/>
        </>
    );
}

function JobItemEdit(props: any) {

    const handleChange = (event: any) => {
        let items = props.job.items;
        items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        props.setJob({
            ...props.job,
            items: items
        });
      };

      const handleDeleteItem = () => {
        let job = props.job;
        let item = job.items.find((it: any) => it === props.item);
        let itemIndex = job.items.indexOf(item);
        let items = job.items.slice(undefined, itemIndex).concat(job.items.slice(itemIndex+1, undefined));
        props.setJob({
            ...props.job,
            items: items
        });
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item={true} xs={4}>
                    <TextField
                    id="title" 
                    label="Service"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={props.item.title ? props.item.title : ''}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item={true} xs={4}>
                </Grid>
                <Grid item={true} xs={4}>
                    <Stack>
                        <TextField
                        id="price" 
                        label="Price"
                        type='number'
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline />
                            </InputAdornment>
                            ),
                        }}
                        value={props.item.price ? props.item.price : ''}
                        onChange={handleChange}
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack>
                <Typography>Description</Typography>
                <RichText content={props.item.description ? props.item.description : ''} {...props}  type='job'/>
                <Button onClick={handleDeleteItem} startIcon={<DeleteOutline />}>Delete Item</Button>
            </Stack>
            <Divider/>
        </>
    );
}

function JobDetails(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const [editting, setEditting] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleEditting = () => {
        if (editting) {
            updateJob(props.job)
            .then(res => {
            }, err => {
            })
        }
        setEditting(!editting);
    }

    const handleAddItem = () => {
        let items = props.job.items;
        items.push({price: 0});
        props.setJob({
            ...props.job,
            items: items
        });
      }

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = (value: string) => {
        setDeleteOpen(false);
        closeMenu();
    };

    const onDelete = () => {
        navigate(`/jobs`);
    }

    return (
        <Card>
            <Stack direction="row">
                <Typography>Job Details</Typography>
                <Button onClick={handleEditting}>{editting ? 'Save Changes' : 'Edit Job'}</Button>
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
                            <MenuItem>
                                <ListItemIcon>
                                    <CreateOutlined />
                                </ListItemIcon>
                                <ListItemText>Edit Property</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <DeleteOutline />
                                </ListItemIcon>
                                <ListItemText>Delete Property</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleDeleteOpen}>
                                <ListItemIcon>
                                    <DeleteOutline />
                                </ListItemIcon>
                                <ListItemText>Delete job</ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Menu>
            </Stack>
            <Stack direction="row">
                <Stack>
                    <Typography>Created</Typography>
                    <Typography>11/27/2022</Typography>
                </Stack>
                <Stack>
                    <Typography>From</Typography>
                    <Typography>Job 3</Typography>
                </Stack>
                <Stack>
                    <Typography>Used for</Typography>
                    <Typography>Invoice 2</Typography>
                </Stack>
                <Stack>
                    <Typography>Status</Typography>
                    <Chip label="Upcoming"/>
                </Stack>
            </Stack>
            {editting && 
                <>
                {props.job.items.map(((item: any, index: number) => (
                    <JobItemEdit key={index} item={item} {...props}/>
                )))}
                <Button onClick={handleAddItem}>
                    <Stack>
                        <AddCircleOutlineOutlined />
                        <Typography>Add Item</Typography>
                    </Stack>
                </Button>
                </>
            }
            {!editting && 
                <>
                {props.job.items.map(((item: any, index: number) => (
                    <JobItemSaved key={index} item={item} {...props}/>
                )))}
                {props.job?.items?.length === 0 && <EmptyState type='job-items'/>}
                </>
            }
            <Divider />
            <Stack direction="row">
                <Typography>Subtotal</Typography>
                <Typography>${props.job.items.map((i: any) => i.price).reduce(add, 0)}</Typography>
            </Stack>
            <ConfirmDelete
            open={deleteOpen}
            onClose={handleDeleteClose}
            type={'jobs'}
            deleteId={props.job.job.id}
            onDelete={onDelete}
            />
        </Card>
    )
}

export default JobDetails;