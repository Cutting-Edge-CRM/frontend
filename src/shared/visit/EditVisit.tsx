import { PersonOutline } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { listProperties } from '../../api/property.api';
import { createVisit, updateVisit } from '../../api/visit.api';
import TimePicker from './TimePicker';
  
export default function EditVisit(props: any) {
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([] as any[])
  
    const handleCancel = () => {
      props.onClose();
    };

    const handleSave = () => {
      if (props.type === 'edit') {
        // save value
        updateVisit({...props.visit, client: props.client, start: convertToDate('start'), end: convertToDate('end')})
        .then(res => {
            props.update(res);
        }, (err) => {
          setError(err.message)
        })
      }
      if (props.type === 'new') {
          // save value
          createVisit({...props.visit, client: props.client, start: convertToDate('start'), end: convertToDate('end')})
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

    const handleAnytime = (event: any) => {
      props.setVisit({ ...props.visit, [event.target.id]: event.target.checked});
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

    const handleChangeProperty = (event: SelectChangeEvent<any>) => {
      props.setVisit({ ...props.visit, property: event.target.value.id});
    };

    const handleStartTimeChange = (time: string) => {
      props.setStartTime(time);
    }

    const handleEndTimeChange = (time: string) => {
      props.setEndTime(time);
    }

    const convertToDate = (type: string) => {
      if (type === 'start') {
        let startDate = dayjs(props.visit.start);
        let [hours, minutes] = props.startTime.split(':');
        if (hours && minutes) {
          return startDate.set('hour', +hours).set('minute', +minutes).toISOString();
        } else {
          return startDate.toISOString();
        }
      } else {
        let endDate = dayjs(props.visit.end);
        let [hours, minutes] = props.endTime.split(':');
        if (hours && minutes) {
          return endDate.set('hour', +hours).set('minute', +minutes).toISOString();
        } else {
          return endDate.toISOString();
        }
      }
      
    }

    useEffect(() => {
      listProperties(props.client)
      .then((result: any[]) => {
        let none = {
          id: null,
          address: "None",
        }
        result.unshift(none);
        setProperties(result);
      }, (err) => {
        setError(err.message)
      })
    }, [props.client])

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
                <InputLabel id="property-label">Property</InputLabel>
                <Select
                labelId="property-label"
                id="property"
                value={properties.find(p => p.id === props.visit.property)}
                onChange={handleChangeProperty}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.address}
                  </Box>
                )}
                >
                {properties.map((property: any) => (
                    <MenuItem key={property.id} value={property}>
                    <Checkbox checked={property.id === props.visit.property} />
                    <ListItemText primary={property.address} />
                    </MenuItem>
                ))}
                </Select>
                <InputLabel id="assigned-label">Assigned</InputLabel>
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
                        <Chip key={value.id} label={value.name ? value.name : value.email} />
                      ))}
                    </Box>
                  )}
                >
                {props.users.map((user: any) => (
                    <MenuItem key={user.id} value={user}>
                    <Checkbox checked={props.visit.users?.map((p: any) => p.id).indexOf(user.id) > -1} />
                    <ListItemText primary={user.name ? user.name : user.email} />
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
                <FormControlLabel control={
                  <Checkbox 
                  id='anytime'
                  checked={+props.visit.anytime === (1 || true)}
                  onChange={handleAnytime}
                  />
                } label="Anytime" />
                
                <Stack direction="row">
                    <TimePicker
                        disabled={+props.visit.anytime === (1 || true)}
                        label="Start Time"
                        value={props.startTime}
                        onChange={handleStartTimeChange}
                    />
                    <TimePicker
                        disabled={+props.visit.anytime === (1 || true)}
                        label="End Time"
                        value={props.endTime}
                        onChange={handleEndTimeChange}
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