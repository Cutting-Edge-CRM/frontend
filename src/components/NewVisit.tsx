import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import * as React from 'react';

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

export interface NewVisitProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
export default function NewVisit(props: NewVisitProps) {
    const { onClose, selectedValue, open } = props;
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
      const {
        target: { value },
      } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
  
    const handleClose = () => {
      onClose(selectedValue);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Create New Visit</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="title" 
                label="Title"
                />
                <InputLabel id="assigned-label">Tag</InputLabel>
                <Select
                labelId="assigned-label"
                id="assigned"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Assign team members" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                {names.map((name) => (
                    <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                    </MenuItem>
                ))}
                </Select>
                <Stack direction="row">
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                        setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => {
                        setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
                <Stack direction="row">

                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    );
  }