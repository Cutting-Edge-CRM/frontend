import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
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
                <Stack>
                <TextField
                id="to" 
                // value={props.item.title ? props.item.title : ''}
                // onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Typography>To</Typography>
                    </InputAdornment>
                    ),
                }}
                />
                <TextField
                id="subject" 
                label="Email Subject"
                // value={props.item.title ? props.item.title : ''}
                // onChange={handleChange}
                />
                <Typography>Email Body</Typography>
                <RichText/>
                </Stack>
            </Box>
            }
            {value === 1 && 
            <Box>
                <Stack>
                <TextField
                id="to" 
                // value={props.item.title ? props.item.title : ''}
                // onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Typography>To</Typography>
                    </InputAdornment>
                    ),
                }}
                />
                <Typography>Text Message</Typography>
                <RichText/>
                </Stack>
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