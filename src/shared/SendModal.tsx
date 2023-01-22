import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import RichText from './RichText';

export default function SendModal(props: any) {
    const [value, setValue] = useState(0);

    const handleCancel = () => {
        props.onClose();
      };

    const handleSend = () => {
      };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    return (
    <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Send {props.type}</DialogTitle>
        <DialogContent>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Email" id="email" />
                <Tab label="SMS" id="sms" />
            </Tabs>
            {value === 0 && 
            <Box>
                <TextField
                id="subject" 
                label="Email Subject"
                // value={props.item.title ? props.item.title : ''}
                // onChange={handleChange}
                />
                <Typography>Email Body</Typography>
                <RichText/>
            </Box>
            }
            {value === 1 && 
            <Box>
                <Typography>Text Message</Typography>
                <RichText/>
            </Box>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    );
  }