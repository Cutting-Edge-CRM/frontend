import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import * as React from 'react';

const names = [
    'Manitoba',
    'Saskatchewan',
    'Alberta',
  ];

export interface NewPropertyProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
export default function NewProperty(props: NewPropertyProps) {
    const { onClose, selectedValue, open } = props;
    const [personName, setPersonName] = React.useState<string>();
  
    const handleClose = () => {
      onClose(selectedValue);
    };
    
    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        setPersonName(event.target.value);
      };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Create New Property</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="address" 
                label="Address"
                />
                <TextField
                id="unit" 
                label="Unit"
                />
                <TextField
                id="city" 
                label="City"
                />
                <Select
                id="state"
                label="State"
                value={personName}
                onChange={handleChange}
                placeholder="State"
                >
                {names.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
                </Select>
                <TextField
                id="zip" 
                label="Postal"
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }