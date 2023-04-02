import { Percent, DeleteOutline, AddCircleOutlineOutlined } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, LinearProgress, TextField, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { createTax, updateTax } from '../api/tax.api';
import { theme } from '../theme/theme';

export default function TaxModal(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        if (props.taxModalType === 'New') {
            setLoading(true);
            createTax(props.taxGroup)
            .then(res => {
                props.onClose();
                setLoading(false);
                props.setReload(!props.reload);
            }, err => {
                setLoading(false);
                setError(err);
            })
        } else {
            setLoading(true);
            updateTax(props.taxGroup)
            .then(res => {
                props.onClose();
                setLoading(false);
            }, err => {
                setLoading(false);
                setError(err);
            })
        }
    }

    const handleChangeTaxGroup = (event: any) => {
        let newTaxGroup = props.taxGroup;
        newTaxGroup[event.target.id] = event.target.value;
        props.setTaxGroup({...newTaxGroup});
      };

    const handleChangeTax = (event: any, index: number) => {
        let newTaxGroup = props.taxGroup;
        newTaxGroup.taxes[index][event.target.id] = event.target.value;
        props.setTaxGroup({...newTaxGroup});
      };
    
      const handleRemoveTax = (event: any, index: number) => {
        let newTaxGroup = props.taxGroup;

        
        newTaxGroup.taxes = newTaxGroup.taxes?.slice(undefined, index)
        .concat(newTaxGroup.taxes?.slice(index + 1, undefined));

        props.setTaxGroup({...newTaxGroup});
      };
    
      const handleAddTax = (event: any) => {
        let newTaxGroup = props.taxGroup;
        newTaxGroup.taxes.push({tax: '', title: ''});
        props.setTaxGroup({...newTaxGroup});
      };


    const handleCancel = () => {
        props.onClose();
      };

    return (
        <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">{props.taxModalType} Tax Group</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <Stack spacing={2}>
            <InputLabel id="tax-label" sx={{ color: 'primary.main' }}>
                Tax Group Name
            </InputLabel>
            <Stack spacing={2}>
                <Stack direction={'row'}>
                    <TextField
                        id="title"
                        value={props.taxGroup?.title}
                        placeholder='Name ie. Standard'
                        onChange={(e) => handleChangeTaxGroup(e)}
                    />
                </Stack>
                    <InputLabel id="tax-label" sx={{ color: 'primary.main' }}>
                    Tax Rates
                    </InputLabel>
                    {props.taxGroup?.taxes?.map((tax: any, index: number) => (
                        <Stack key={index} direction='row' spacing={2}>
                        <TextField
                            id="title"
                            value={tax.title}
                            placeholder='Name ie. GST'
                            onChange={(e) => handleChangeTax(e, index)}
                        />
                        <TextField
                            id="tax"
                            value={tax.tax}
                            label="Rate (%)"
                            onChange={(e) => handleChangeTax(e, index)}
                            InputProps={{
                                endAdornment: (
                                    <Percent />
                                ),
                            }}
                        />
                        <IconButton onClick={(e) => handleRemoveTax(e, index)}>
                            <DeleteOutline color="error" />
                        </IconButton>
                        </Stack>
                    ))}
                    <Button
                    sx={{ alignSelf: 'flex-start' }}
                    onClick={(e) => handleAddTax(e)}
                    startIcon={<AddCircleOutlineOutlined color="primary" />}
                    >
                        Add Tax Rate
                    </Button>
                </Stack>
        </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }