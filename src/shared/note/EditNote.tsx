import { AddAPhotoOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';

export default function EditNote(props: any) {

    const handleCancel = () => {
      props.onClose();
    };

    const handleSave = () => {
      if (props.type === 'edit') props.update();
      if (props.type === 'new') props.create();
    };

    const handleChange = (event: any) => {
      props.setVisit({ ...props.visit, [event.target.id]: event.target.value});
    };

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="title" 
                label="Title"
                defaultValue={props.note.title ? props.note.title : undefined}
                onChange={handleChange}
                />
                <TextField
                id="content" 
                label="Content"
                defaultValue={props.note.content ? props.note.content : undefined}
                onChange={handleChange}
                />
                <Box>
                    <Typography>Drag & drog photos here</Typography>
                    <AddAPhotoOutlined/>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }