import { AttachMoney } from '@mui/icons-material';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, InputLabel, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { createPayment, updatePayment } from '../api/payment.api';

export default function PaymentModal(props: any) {
    const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'Credit Card', 'Money Order', 'Other'];

    const handleCancel = () => {
        props.onClose();
      };

    const handleSave = () => {
        if (props.type === 'new') {
            createPayment(props.payment)
            .then(res => {
                console.log(res);
                props.onClose();
            }, err => {

            })
        }
        if (props.type === 'edit') {
            updatePayment(props.payment)
            .then(res => {
                props.onClose();
            }, err => {

            })
        }
    };

    const handleSaveAndReciept = () => {

    };

    const handleChange = (event: any) => {
        props.setPayment({ ...props.payment, [event.target.id]: event.target.value.trim()});
      };

    const handleChangeMethod = (event: any) => {
        props.setPayment({ ...props.payment, method: event.target.value.trim()});
      };

    const handlePaymentDateChange = (date: any) => {
        props.setPayment({ ...props.payment, transDate: date});
    }

    
    return (
    <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Send {props.paymentType}</DialogTitle>
        <DialogContent>
        <Stack>
            <InputLabel id="method-label">Property</InputLabel>
            <Select
            labelId="method-label"
            id="method"
            value={props.payment.method}
            onChange={handleChangeMethod}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected}
                </Box>
            )}
            >
            {paymentMethods.map((method: any) => (
                <MenuItem key={method} value={method}>
                <Checkbox checked={method === props.payment.method} />
                <ListItemText primary={method} />
                </MenuItem>
            ))}
            </Select>
            <TextField
            id="amount" 
            label="Amount"
            defaultValue={props.payment.amount ? props.payment.amount : undefined}
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <AttachMoney />
                </InputAdornment>
                ),
            }}
            />
            <DatePicker
                label="Payment Date"
                value={props.payment.transDate}
                onChange={handlePaymentDateChange}
                renderInput={(params) => <TextField {...params} />}
            />
            <TextField
            multiline
            minRows={3}
            id="details" 
            label="Details"
            defaultValue={props.payment.details ? props.payment.details : undefined}
            onChange={handleChange}
            />
        </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveAndReciept}>Save & Email Receipt</Button>
            <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }