import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../auth/firebase';
import { theme } from '../theme/theme';

export default function ConfirmPasswordModal(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const handleCancel = () => {
        props.onClose();
      };

    const handleCheckPassword = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, props.email, password)
        .then(res => {
            setLoading(false);
            props.confirmed();
            props.onClose();
        }, err => {
            setLoading(false);
            setError(err.message);
        })
    }

    const handleChange = (e: any) => {
        setPassword(e.target.value);
    }

    return (
        <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">Confirm Password</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <Stack spacing={2}>
            <TextField
                id="password"
                type={'password'}
                value={password}
                onChange={handleChange}
            />
        </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleCheckPassword}>Confirm</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }