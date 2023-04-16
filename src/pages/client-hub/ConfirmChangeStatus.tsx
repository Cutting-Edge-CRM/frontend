import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, LinearProgress, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createTimeline, updateQuote } from './api/clientPublic.api';
import Terms from './Terms';


export default function ConfirmDelete(props: any) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const handleCancel = () => {
        props.onClose();
      };

    const handleTermsClose = (value: string) => {
      setTermsOpen(false);
    };

    const handleOpenTerms = () => {
        setTermsOpen(true);
    }

    const handleTermsCheck = (event: any) => {
      setTermsChecked(event.target.checked);
    }

  
    const handleConfirm = () => {
        setLoading(true);
        props.quote.quote.status = props.type;
        updateQuote(props.quote)
        .then(res => {
            setLoading(false);
            let timeline_event = {
                client: props.quote.quote.client,
                resourceId: props.quote.quote.id,
                resourceType: 'quote',
                resourceAction: `client-${props.type.toLowerCase()}`
              };
            createTimeline(timeline_event);
            props.onClose();
            props.success(`Successfully ${props.type} Quote`);
        }, err => {
            setLoading(false);
            setError(err.message);
        })
      };

    useEffect(() => {
        switch (props.type) {
            case 'Approved':
                setTitle(`Approve Quote`);
                setBody(`Approve this quote for the total price of $${props.price}?`);
                break;
            case 'Rejected':
                setTitle('Reject Quote');
                setBody(`Are you sure you want to reject this quote?`);
                break;
            default:
                break;
        }
    }, [props.type, props.price])  
    
    return (
    // <Dialog onClose={handleCancel} open={props.open}>
    //     <DialogContent>
    //         {loading && <LinearProgress />}
    //         <Typography>{title}</Typography>
    //         <Typography>{body}</Typography>
    //     </DialogContent>
    //     <DialogActions>
    //         <Button onClick={handleCancel}>Cancel</Button>
    //         <Button onClick={handleConfirm}>{title}</Button>
    //     </DialogActions>
    //     {error && <Alert severity="error">{error}</Alert>}
    //   </Dialog>
          <Dialog onClose={handleCancel} open={props.open}>
          <DialogContent>
            {loading && <LinearProgress />}
            <Stack
              spacing={2}
              justifyContent="center"
              alignItems="center"
              maxWidth={400}
            >
              <Typography fontWeight={600} variant="h6" color="primary">
                {title}
              </Typography>
              <Typography textAlign="center" variant="body1" color="neutral.main">
                {body}
              </Typography>
              <Stack direction={'row'} alignItems="center" sx={{display: props.settings?.terms?.length > 20 ? 'flex' : 'none'}}>
                <Checkbox onChange={handleTermsCheck} checked={termsChecked} />
                <Typography textAlign="center" variant="body2" color="neutral.main">
                I agree to the {<Button onClick={handleOpenTerms} sx={{padding: 0}} >Terms & Conditions</Button>}
                </Typography>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="primary" disabled={!termsChecked && props.settings?.terms?.length > 20}>
              {title}
            </Button>
          </DialogActions>
          {error && <Alert severity="error">{error}</Alert>}
          <Terms
            open={termsOpen}
            onClose={handleTermsClose}
            settings={props.settings}
            />
        </Dialog>
    );
  }