import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';

export default function TimePickerV2(props: any) {

    const [AM, setAM] = useState(dayjs(props.value).get('hour') < 12);

    const handleChangeAM = (e: any) => {
        if (e.target.value === 'am') {
            props.onChange(dayjs(props.value).subtract(12, 'hour'));
            setAM(true);
        } else {
            props.onChange(dayjs(props.value).add(12, 'hour'));
            setAM(false);
        }
    }

    const handleChangeHour = (e: any) => {
        let newTime = dayjs(props.value);
        newTime = newTime.set('hour', e.target.value);
        props.onChange(newTime);

    }

    const handleChangeMinute = (e: any) => {
        if (e.target.value === '00') {
            e.target.value = e.target.value[2];
          }
          if (e.target.value === '') {
            e.target.value = 0;
          }
        let newTime = dayjs(props.value);
        newTime = newTime.set('minute', e.target.value);
        props.onChange(newTime);
    }

    return (
        <>
        <Box display={'flex'} alignItems="center"
        sx={{
            border: '1px solid #C4C4C4',
            borderRadius: '20px'
        }}
        >
        <TextField
            disabled={props.disabled}
            id="hours"
            value={dayjs(props.value).get('hour') <= 12 ? dayjs(props.value).get('hour') : dayjs(props.value).get('hour') - 12}
            onChange={handleChangeHour}
            variant="standard"
            InputProps={{
                disableUnderline: true,
              }}
              sx={{  '& input': {
                textAlign: 'right',
                width: 50,
                padding: '0px !important',
                borderRadius: 0
              }}}
        />
        <Typography marginX={1}>:</Typography>
        <TextField
            disabled={props.disabled}
            id="minutes"
            value={dayjs(props.value).get('minute') === 0 ? '00' : dayjs(props.value).get('minute')}
            onChange={handleChangeMinute}
            variant="standard"
            InputProps={{
                disableUnderline: true,
              }}
            sx={{
                width: 50,
                '& input': {
                    padding: '0px !important',
                    borderRadius: 0
                  }
            }}
        />
        </Box>
        <Select 
            disabled={props.disabled}
            value={AM ? 'am' : 'pm'}
            onChange={handleChangeAM}
        >
            <MenuItem value={'am'}>AM</MenuItem>
            <MenuItem value={'pm'}>PM</MenuItem>
        </Select>
        </>
    );
  }