import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { listProperties } from '../../api/property.api';
import { createVisit, updateVisit } from '../../api/visit.api';
import { theme } from '../../theme/theme';
import TimePickerV2 from './TimePickerV2';


export default function EditVisit(props: any) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([] as any[]);

  const visitTypes = props.job || props.visit.job ? ['Estimate', 'Job', 'Task', 'Reminder'] : ['Estimate', 'Task', 'Reminder'];

  const handleCancel = () => {
    props.onClose();
  };

  const handleSave = () => {
    setLoading(true);
    if (props.type === 'edit') {
      // save value
      updateVisit({
        ...props.visit,
        job: props.visit.type === 'Job' && !!props.job ? props.job.job?.id : props.visit.job,
        property: (typeof props.visit?.property === 'number') ? props.visit.property : null,
        client: props.client,
        start: convertToDate('start'),
        displayEnd: convertToDate('end'),
        end: convertToDate('end'),
      }).then(
        (res) => {
          setLoading(false);
          props.update(res);
          props.setReload(!props.reload);
          props.success('Successfully updated visit');
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
    if (props.type === 'new') {
      // save value
      createVisit({
        ...props.visit,
        job: props.visit.type === 'Job' && !!props.job ? props.job.job?.id : props.visit.job,
        property: (typeof props.visit?.property === 'number')? props.visit.property : null,
        client: props.client,
        start: convertToDate('start'),
        displayEnd: convertToDate('end'),
        end: convertToDate('end'),
      }).then(
        (res) => {
          setLoading(false);
          props.create(res);
          props.setReload(!props.reload);
          props.success('Successfully created new visit');
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
  };


  const handleChange = (event: any) => {
    props.setVisit({ ...props.visit, [event.target.id]: event.target.value });
  };

  const handleAnytime = (event: any) => {
    props.setVisit({ ...props.visit, [event.target.id]: event.target.checked });
  };

  const handleUnscheduled = (event: any) => {
    props.setVisit({ ...props.visit, [event.target.id]: event.target.checked });
  };

  const handStartChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(props.visit.start);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      props.setVisit({ ...props.visit, start: newDate }); 
    } else {
      props.setVisit({ ...props.visit, start: newTime }); 
    }
  };

  const handEndChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(props.visit.displayEnd);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      props.setVisit({ ...props.visit, displayEnd: newDate, end: newDate }); 
    } else {
      props.setVisit({ ...props.visit, displayEnd: newTime, end: newDate }); 
    }
  };

  const handDateChange = (date: any) => {
    let newTime = dayjs(date);
    let newDate = dayjs(props.visit.start);
    if (newDate.isValid()) {
      newDate = newDate.set('date', newTime.get("date"));
      newDate = newDate.set('month', newTime.get("month"));
      newDate = newDate.set('year', newTime.get("year"));
      props.setVisit({ ...props.visit, start: newDate, displayEnd: newDate, end: newDate }); 
    } else {
      props.setVisit({ ...props.visit, start: newTime, displayEnd: newDate, end: newDate }); 
    }
  }

  const handleChangePerson = (event: SelectChangeEvent<any>) => {
    props.setVisit({ ...props.visit, users: event.target.value });
  };

  const handleChangeProperty = (event: SelectChangeEvent<any>) => {
    props.setVisit({ ...props.visit, property: event.target.value.id });
  };

  const handleChangeType = (event: SelectChangeEvent<any>) => {
    props.setVisit({ ...props.visit, type: event.target.value });
  };

  const handleStartTimeChange = (time: string) => {
    let newTime = dayjs(time);
    let newDate = dayjs(props.visit.start);
    newDate = newDate.set('hour', newTime.get("hour"));
    newDate = newDate.set('minute', newTime.get("minute"));
    props.setVisit({ ...props.visit, start: newDate });
  };

  const handleEndTimeChange = (time: string) => {
    let newTime = dayjs(time);
    let newDate = dayjs(props.visit.displayEnd);
    newDate = newDate.set('hour', newTime.get("hour"));
    newDate = newDate.set('minute', newTime.get("minute"));
    props.setVisit({ ...props.visit, displayEnd: newDate, end: newDate }); 
 };

  const checkValid = () => {
    if ((!dayjs(props.visit.start).isValid() || !dayjs(props.visit.displayEnd).isValid()) && !props.visit.unscheduled) return false;
    return true;
  }

  const convertToDate = (type: string) => {
    if (props.visit.unscheduled) return null;
    if (type === 'start') {
      return dayjs(props.visit.start).toISOString();
    } else {
      return dayjs(props.visit.displayEnd).toISOString();
    }
  };

  useEffect(() => {
    listProperties(props.client).then(
      (result: any[]) => {
        setProperties(result);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, [props.client, props.reload]);

  return (
    <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}  onClose={handleCancel} open={props.open}>
      <DialogTitle align="center">
        {props.type === 'edit' ? 'Edit Visit' : 'Create New Visit'}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <Stack spacing={1.5} mt={2}>
          <InputLabel id="type-label" sx={{ color: 'primary.main' }}>
              Visit type
          </InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={props.visit?.type ?? "Estimate"}
            onChange={handleChangeType}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected}
              </Box>
            )}
          >
            {visitTypes.map((type: any) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={type === props.visit.type} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="property-label" sx={{ color: 'primary.main' }}>
            Property
          </InputLabel>
          <Select
            labelId="property-label"
            id="property"
            value={properties.find((p) => p.id === props.visit.property) ?? ''}
            displayEmpty={true}
            onChange={handleChangeProperty}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected?.address}
                {selected.length === 0 && (
                  <Typography>None</Typography>
                )}
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
          <InputLabel id="assigned-label" sx={{ color: 'primary.main' }}>
            Assigned
          </InputLabel>
          <Select
            labelId="assigned-label"
            id="assigned"
            multiple
            value={props.visit.users}
            onChange={handleChangePerson}
            input={<OutlinedInput label="Assign team members" />}
            displayEmpty={true}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value: any) => (
                  <Chip
                    key={value.id}
                    label={value.name ? value.name : value.email}
                  />
                ))}
                {selected.length === 0 && (
                  <Typography>No users are currently assigned</Typography>
                )}
              </Box>
            )}
          >
            {props.users.map((user: any) => (
              <MenuItem key={user.id} value={user}>
                <Checkbox
                  checked={
                    props.visit.users?.map((p: any) => p.id).indexOf(user.id) >
                    -1
                  }
                />
                <ListItemText primary={user.name ? user.name : user.email} />
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="notes-label" sx={{ color: 'primary.main' }}>
              Notes
          </InputLabel>
          <TextField
              id="notes"
              multiline
              minRows={5}
              value={
              props.visit.notes ?? ""
              }
              onChange={handleChange}
          />
          <InputLabel id="schedule-label" sx={{ color: 'primary.main' }}>
            Schedule
          </InputLabel>
          <FormControlLabel
            control={
              <Checkbox
                id="unscheduled"
                checked={+props.visit.unscheduled === (1 || true)}
                onChange={handleUnscheduled}
              />
            }
            label="Unscheduled"
          />
          {props.visit?.type === 'Job' ? 
            <Stack direction="row" justifyContent="space-between" width="100%">
              <DatePicker
                label="Start Date"
                disabled={+props.visit.unscheduled === (1 || true)}
                value={props.visit.start}
                maxDate={props.visit.displayEnd}
                onChange={handStartChange}
                renderInput={(params) => <TextField {...params} />}
                OpenPickerButtonProps={{
                  color: 'primary',
                }}
              />
              <DatePicker
                label="End Date"
                disabled={+props.visit.unscheduled === (1 || true)}
                value={props.visit.displayEnd}
                minDate={props.visit.start}
                onChange={handEndChange}
                renderInput={(params) => <TextField {...params} />}
                OpenPickerButtonProps={{
                  color: 'primary',
                }}
              />
          </Stack>
          :
          <>
          <Stack direction="row" justifyContent="center" width="100%">
            <DatePicker
              label="Date"
              disabled={+props.visit.unscheduled === (1 || true)}
              value={props.visit.start}
              onChange={handDateChange}
              renderInput={(params) => <TextField {...params} />}
              OpenPickerButtonProps={{
                color: 'primary',
              }}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                id="anytime"
                disabled={+props.visit.unscheduled === (1 || true) || (dayjs(props.visit.displayEnd).diff(props.visit.start, 'days') >= 1)}
                checked={+props.visit.anytime === (1 || true) || +props.visit.unscheduled === (1 || true) || (dayjs(props.visit.displayEnd).diff(props.visit.start, 'days') >= 1)}
                onChange={handleAnytime}
              />
            }
            label="Anytime"
          />
            <Stack direction="row" spacing={1}>
              <TimePickerV2
                disabled={+props.visit.anytime === (1 || true) || +props.visit.unscheduled === (1 || true) || (dayjs(props.visit.displayEnd).diff(props.visit.start, 'days') >= 1)}
                label="Start Time"
                value={props.visit.start}
                onChange={handleStartTimeChange}
              />
              <TimePickerV2
                disabled={+props.visit.anytime === (1 || true) || +props.visit.unscheduled === (1 || true) || (dayjs(props.visit.displayEnd).diff(props.visit.start, 'days') >= 1)}
                label="End Time"
                value={props.visit.displayEnd}
                onChange={handleEndTimeChange}
              />
            </Stack>
          </>
          }
          <Stack direction="row"></Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!checkValid()}>
          Save Changes
        </Button>
      </DialogActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Dialog>
  );
}
