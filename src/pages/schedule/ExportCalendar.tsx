import { Button, Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { auth } from "../../auth/firebase";


export default function ExportCalendarModal(props: any) {
    const handleCancel = () => {
        props.onClose();
      };
    
    return (
          <Dialog onClose={handleCancel} open={props.open}>
          <DialogContent>
          <Stack
              spacing={2}
              justifyContent="center"
              alignItems="center"
              maxWidth={400}
            >
              <Typography fontWeight={600} variant="h6" color="primary">
                Calendar Sync
              </Typography>
              <Typography fontWeight={400} textAlign="center">
                Copy the following URL into your calendar to subscribe to events
              </Typography>
              <TextField value={`https://server.cuttingedgecrm.com/calendar/calendar/${auth.tenantId as string}`} fullWidth>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
    );
  }