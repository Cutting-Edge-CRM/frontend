import { AddAPhotoOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';

export interface EditNoteProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
export default function EditNote(props: EditNoteProps) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="title" 
                label="Title"
                />
                <TextField
                id="content" 
                label="Content"
                />
                <Box>
                    <Typography>Drag & drog photos here</Typography>
                    <AddAPhotoOutlined/>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }