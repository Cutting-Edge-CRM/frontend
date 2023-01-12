import { Alert, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteClient } from '../api/client.api';
import { deleteProperty } from '../api/property.api';
import { deleteVisit } from '../api/visit.api';

export default function ConfirmDelete(props: any) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);
    const [deleteable, setDeletable] = useState('');

    const handleCancel = () => {
        props.onClose();
      };
  
    const handleDelete = () => {
        let response = {} as Promise<any>;
        switch (props.type) {
            case 'quotes':
                response = deleteVisit(deleteable);
                break;
            case 'jobs':
                response = deleteVisit(deleteable);
                break;
            case 'invoices':
                response = deleteVisit(deleteable);
                break;
            case 'properties':
                response = deleteProperty(deleteable);
                break;
            case 'clients':
                response = deleteClient(deleteable);
                break;
            case 'visits':
                response = deleteVisit(deleteable);
                break;
            case 'notes':
                response = deleteVisit(deleteable);
                break;
            default:
                break;
        }
        response
        .then(res => {
            props.onClose();
        }, err => {
            setError(err.message);
        });
      };

    useEffect(() => {
        setDeletable(props.deleteId)
        switch (props.type) {
            case 'quotes':
                setTitle(`No Quotes`);
                setBody(`You haven't created any quotes yet, click "New Quote" above to create one!`);
                break;
            case 'jobs':
                setTitle('No Jobs');
                setBody(`You haven't created any jobs yet, click "New Job" above to create one!`);
                break;
            case 'invoices':
                setTitle('No Invoices');
                setBody(`You haven't created any invoices yet, click "New Invoice" above to create one!`);
                break;
            case 'properties':
                setTitle('Delete Property');
                setBody(`Are you sure you want to delete this property? This is will delete any quotes, jobs & visits associated to this property.`);
                break;
            case 'clients':
                setTitle('Delete Client');
                setBody(`Are you sure you want to delete this client? This is will delete any quotes, jobs, invoices, properties, visits & notes associated to this client.`);
                break;
            case 'visits':
                setTitle('Delete Visit');
                setBody(`Are you sure you want to delete this visit?`);
                break;
            case 'notes':
                setTitle('No Clients');
                setBody(`You haven't created any clients yet, click "New Client" above to create one!`);
                break;
            default:
                break;
        }
    }, [props.type, props.deleteId])  
    
    return (
    <Dialog onClose={handleCancel} open={props.open}>
        <DialogContent>
            <Typography>{title}</Typography>
            <Typography>{body}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }