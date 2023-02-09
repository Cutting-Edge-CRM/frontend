import {
  AddCircleOutlineOutlined,
  CreateOutlined,
  DeleteOutline,
  MoreVert,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { listNotes } from '../../api/note.api';
import { currentUserClaims } from '../../auth/firebase';
import ConfirmDelete from '../ConfirmDelete';
import EmptyState from '../EmptyState';
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
  const [fileURLs, setFileURLs] = useState([] as { url: string; file: File }[]);
  const [originalImages, setOriginalImages] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    note: any,
    urls: any
  ) => {
    setNote(note);
    setFileURLs(urls);
    setOriginalImages(urls);
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleNewOpen = () => {
    setNote({ client: props.client });
    setFileURLs([]);
    setType('New');
    setOpen(true);
  };

  const handleEditOpen = () => {
    setType('Edit');
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setNote({ client: props.client });
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
    listNotes(props.client).then(
      (result) => {
        setRows(result);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  }, [props, open, deleteOpen]);

  const onDelete = () => {
    return;
  };

  return (
    <Card sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={600} fontSize={18}>
          Notes
        </Typography>
        {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
        <IconButton onClick={handleNewOpen} color="info">
          <AddCircleOutlineOutlined />
        </IconButton>
        }
      </Stack>
      {loading && <Box textAlign='center'><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List>
          {rows.map((note: any) => (
            <ListItem
              sx={{
                backgroundColor: 'warning.light',
                borderRadius: '10px',
                mt: 2,
                paddingRight: 0,
                pt: 2,
                pb: 2,
              }}
              key={note.id}
            >
              <Grid container spacing={2}>
                <Grid item={true} xs={10}>
                  <Stack>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ opacity: 0.7, mt: 1 }}
                    >
                      {note.title}
                    </Typography>
                    {note.content && (
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.7, mt: 1 }}
                      >
                        {note.content}
                      </Typography>
                    )}
                    {note.date && (
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        sx={{ opacity: 0.7, mt: 1 }}
                      >
                        {note.date}
                      </Typography>
                    )}
                    <ImageList
                      cols={2}
                      sx={{ mt: 1.5 }}
                    >
                      {note.images.map((image: any) => (
                        <ImageListItem key={image.id}>
                          {/* eslint-disable-next-line */}
                          <img
                            src={image.url}
                            style={{ borderRadius: '4px' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Stack>
                </Grid>
                <Grid
                  item={true}
                  xs={2}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
                  <IconButton
                    onClick={(e) => openMenu(e, note, note.images)}
                    color="primary"
                  >
                    <MoreVert />
                  </IconButton>
                  }
                  <Menu
                    id="note-menu"
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={closeMenu}
                  >
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          handleEditOpen();
                        }}
                      >
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
          ))}
          {rows.length === 0 && (
            <EmptyState type="notes"/>
          )}
        </List>
      )}
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
  );
}

export default Notes;
