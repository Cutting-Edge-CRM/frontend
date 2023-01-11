import { PersonOutline } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import * as React from 'react';
import { useState } from 'react';
import { createVisit, updateVisit } from '../../api/visit.api';
  
export default function EditVisit(props: any) {
  const [error, setError] = useState(null);
    
    const handleCancel = () => {
      props.onClose();
    };

    const handleSave = () => {
      if (props.type === 'edit') {
        // save value
        updateVisit({...props.visit, client: props.client})
        .then(res => {
            props.update(res);
        }, (err) => {
          setError(err.message)
        })
      }
      if (props.type === 'new') {
          // save value
          createVisit({...props.visit, client: props.client})
          .then(res => {
              props.create(res);
          }, (err) => {
            setError(err.message)
          })
      }
    };

    const handleChange = (event: any) => {
      props.setVisit({ ...props.visit, [event.target.id]: event.target.value});
    };

    const handStartChange = (date: any) => {
      props.setVisit({ ...props.visit, start: date});
    }

    const handEndChange = (date: any) => {
      props.setVisit({ ...props.visit, end: date});
    }

    const handleChangePerson = (event: SelectChangeEvent<any>) => {
      props.setVisit({ ...props.visit, users: event.target.value});
    };

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>{props.type === 'edit' ? "Edit Visit" : "Create New Visit"}</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <TextField
                id="name" 
                label="Title"
                defaultValue={props.visit.name ? props.visit.name : undefined}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <PersonOutline />
                    </InputAdornment>
                    ),
                }}
                />
                <InputLabel id="assigned-label">Tag</InputLabel>
                <Select
                labelId="assigned-label"
                id="assigned"
                multiple
                value={props.visit.users}
                onChange={handleChangePerson}
                input={<OutlinedInput label="Assign team members" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value: any) => (
                        <Chip key={value.id} label={value.name} />
                      ))}
                    </Box>
                  )}
                >
                {props.users.map((user: any) => (
                    <MenuItem key={user.id} value={user}>
                    <Checkbox checked={props.visit.users?.map((p: any) => p.id).indexOf(user.id) > -1} />
                    <ListItemText primary={user.name} />
                    </MenuItem>
                ))}
                </Select>
                <Stack direction="row">
                    <DatePicker
                        label="Start Date"
                        value={props.visit.start}
                        onChange={handStartChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={props.visit.end}
                        onChange={handEndChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
                <Stack direction="row">

                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }