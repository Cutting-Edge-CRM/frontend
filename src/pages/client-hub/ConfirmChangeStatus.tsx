import { Alert, Button, Dialog, DialogActions, DialogContent, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { updateQuote } from '../../api/quote.api';


export default function ConfirmDelete(props: any) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        props.onClose();
      };

  
    const handleConfirm = () => {
        setLoading(true);
        props.quote.quote.status = props.type;
        updateQuote(props.quote)
        .then(res => {
            setLoading(false);
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
    <Dialog onClose={handleCancel} open={props.open}>
        <DialogContent>
            {loading && <LinearProgress />}
            <Typography>{title}</Typography>
            <Typography>{body}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleConfirm}>{title}</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }