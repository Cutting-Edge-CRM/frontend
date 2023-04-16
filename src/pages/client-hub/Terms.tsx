import { Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery } from '@mui/material';
import React, {  } from 'react';
import { theme } from '../../theme/theme';


export default function Terms(props: any) {

    const handleCancel = () => {
        props.onClose();
      };

    return (
        <Dialog onClose={handleCancel} open={props.open} fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}>
          <DialogContent>
            <Typography
                variant="body2"
                color="neutral.main"
                dangerouslySetInnerHTML={{ __html: props.settings?.terms }}
            ></Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
    );
  }