import { AttachMoney } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import {
  createPayment,
  deletePayment,
  updatePayment,
} from '../api/payment.api';
import { createTimeline } from '../api/timeline.api';

export default function PaymentModal(props: any) {
  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Cheque',
    'Credit Card',
    'Money Order',
    'Other',
  ];

  const handleCancel = () => {
    props.onClose();
  };

  const handleSave = () => {
    if (props.type === 'new') {
      createPayment(props.payment).then(
        (res) => {
          let timeline_event = {
            client: props.payment.client,
            resourceId: res.id,
            resourceType: props.paymentType?.toLowerCase(),
            resourceAction: 'created'
          };
          createTimeline(timeline_event);
          props.onClose();
          props.success('Successfully recorded payment');
        },
        (err) => {}
      );
    }
    if (props.type === 'edit') {
      updatePayment(props.payment).then(
        (res) => {
          props.onClose();
          props.success('Successfully updated payment record');
        },
        (err) => {}
      );
    }
  };

  const handleSaveAndReciept = () => {};

  const handleDelete = () => {
    deletePayment(props.payment.id).then(
      (res) => {
        props.onClose();
        props.success('Successfully deleted payment record');
      },
      (err) => {}
    );
  };

  const handleChange = (event: any) => {
    props.setPayment({
      ...props.payment,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleChangeMethod = (event: any) => {
    props.setPayment({ ...props.payment, method: event.target.value.trim() });
  };

  const handlePaymentDateChange = (date: any) => {
    props.setPayment({ ...props.payment, transDate: date });
  };

  return (
    <Dialog onClose={handleCancel} open={props.open}>
      <DialogTitle align="center">Collect {props.paymentType}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <InputLabel id="method-label" sx={{ color: 'primary.main' }}>
              Property
            </InputLabel>
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
          </Stack>
          <TextField
            id="amount"
            label="Amount"
            defaultValue={
              props.payment.amount ? props.payment.amount : undefined
            }
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <DatePicker
            label="Payment Date"
            value={props.payment.transDate}
            onChange={handlePaymentDateChange}
            renderInput={(params) => <TextField {...params} />}
            OpenPickerButtonProps={{
              color: 'primary',
            }}
          />
          <TextField
            multiline
            minRows={3}
            id="details"
            label="Details"
            defaultValue={
              props.payment.details ? props.payment.details : undefined
            }
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        {props.type === 'edit' && (
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        )}
        <Button onClick={handleSaveAndReciept}>Save & Email Receipt</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
