import { MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import RegexParser from 'regex-parser';

export default function TimePicker(props: any) {

    const [AM, setAM] = useState(true);


    const formatTime = (time: string) => {
        time = time.replace(RegexParser("[a-zA-Z.,;!#$%&'*+/=?^_`{|}~-]"), "")
        time = time.replace(":", "")
        if (time.length >= 4) {
            let valid4Digit = RegexParser("1[0-2]..");
            if (valid4Digit.test(time)) {
                time = time.slice(0,2) + ":" + time.slice(2,4);
                return time;
            } else {
                time = time.slice(0,1) + ":" + time.slice(1,3);
                return time;
            }
        } else if (time.length === 3){
            time = time.slice(0,1) + ":" + time.slice(1,3);
            return time;
        } else if (time.length === 2){
            time = time.slice(0,1) + ":" + time.slice(1,2);
            return time;
        } else {
            return time;
        }
        
    }

    const add12 = (time: string) => {
        if (time.includes(":")) {
            let sections = time.split(":");
            return (+sections[0] + 12).toString() + ":" + sections[1];
        } else {
            return (+time + 12).toString()
        }
    }

    const sub12 = (time: string) => {
        if (time.includes(":")) {
            let sections = time.split(":");
            return (+sections[0] - 12).toString() + ":" + sections[1];
        } else {
            if (+time - 12 === 0) return '';
            return (+time - 12).toString();
        }
    }

    const handleChange = (e: any) => {
        if (AM) {
            props.onChange(formatTime(e.target.value));
        } else {
            props.onChange(add12(formatTime(e.target.value)));
        }        
    }

    const handleChangeAM = (e: any) => {
        if (e.target.value === 'am') {
            props.onChange(sub12(props.value));
            setAM(true);
        } else {
            props.onChange(add12(props.value));
            setAM(false);
        }
    }

    const valid = () => {
     let validTime = RegexParser('/^(([01]?[0-9]|2[0-3]):([0-5][0-9]))?$/');
     return !validTime.test(props.value);
    }

    return (
        <>
        <TextField
            id={`${props.type}-time`}
            label={`${props.label}`}
            value={ AM ? props.value : sub12(props.value)}
            onChange={handleChange}
            error={valid()}
            />
        <Select 
            value={AM ? 'am' : 'pm'}
            onChange={handleChangeAM}
        >
            <MenuItem value={'am'}>AM</MenuItem>
            <MenuItem value={'pm'}>PM</MenuItem>
        </Select>
        </>
    );
  }