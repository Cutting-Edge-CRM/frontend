import { Percent, DeleteOutline, AddCircleOutlineOutlined } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, LinearProgress, TextField, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { listTaxes, updateTaxes } from '../api/tax.api';
import { theme } from '../theme/theme';

export default function TaxModal(props: any) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [taxes, setTaxes] = useState({} as any);


    useEffect(() => {
        setLoading(true)
        listTaxes()
        .then((result) => {
            setLoading(false);
            setTaxes({taxes: result.map((r: any) => {
                return {
                    ...r,
                    tax: (r.tax*100).toFixed(2)
                }
            })});
        }, (err) => {
            setLoading(false);
            setError(err.message);
        })
        }, []);

    const handleSave = () => {
        setLoading(true);
        updateTaxes(taxes)
        .then(res => {
            props.onClose();
            setLoading(false);
        }, err => {
            setLoading(false);
            setError(err);
        })
    }

    const handleChangeTax = (event: any, index: number) => {
        let newTaxes = taxes?.taxes;
        newTaxes[index][event.target.id] = event.target.value;
        setTaxes({taxes: newTaxes});
      };
    
      const handleRemoveTax = (event: any, index: number) => {
        let newTaxes = taxes?.taxes;
        newTaxes = newTaxes
          .slice(undefined, index)
          .concat(newTaxes.slice(index + 1, undefined));
          setTaxes({taxes: newTaxes});
      };
    
      const handleAddTax = (event: any) => {
        let newTaxes = taxes?.taxes;
        newTaxes.push({tax: '', title: ''});
        setTaxes({taxes: newTaxes});
      };


    const handleCancel = () => {
        props.onClose();
      };

    return (
        <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">Tax Settings</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <Stack spacing={2}>
            <InputLabel id="tax-label" sx={{ color: 'primary.main' }}>
                Tax Rates
            </InputLabel>
            {taxes?.taxes?.map((tax: any, index: number) => (
                <Stack key={index} direction='row' spacing={2}>
                    <TextField
                        id="title"
                        value={tax.title}
                        label="Name"
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
            onClick={handleAddTax}
            startIcon={<AddCircleOutlineOutlined color="primary" />}
            >
                Add Tax Rate
            </Button>
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