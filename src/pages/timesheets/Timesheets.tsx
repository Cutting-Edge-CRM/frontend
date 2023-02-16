import { Close, Edit, Save } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Divider, Grid, IconButton, Popover, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { clock, createTimesheet, getClockStatus, listTimesheets } from '../../api/timesheet.api';
import { listUsers } from '../../api/user.api';

function sumTimeForWeek(user: any, times: any) {
    let userTimesheets = times.find((t: any) => t.user === user.id)?.times;
    let sum = 0;
    userTimesheets?.forEach((ut: any) => {
        sum = sum + ut.time
    });
    return `${Math.floor(sum/60) < 10 ? 0 : ''}${Math.floor(sum/60)}:${sum%60 < 10 ? 0 : ''}${sum%60}`;
}

function Week(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);
    const [editVisible, setEditVisible] = useState(-1);
    const [editting, setEditting] = useState(-1);
    const [toSave, setToSave] = useState(0);
    const [saving, setSaving] = useState(-1);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const handleSetVisible = (number: number) => {
        setEditVisible(number);
    }

    const handleSetHidden = () => {
        setEditVisible(-1);
    }

    const handleEditting = (number: number) => {
        setEditting(number);
    }

    const handleSave = (number: number, date: any) => {
        setEditting(-1);
        setSaving(number);
        let newTimesheet = {
            user: props.user.id,
            date: date,
            time: Math.floor(toSave*60)
        }
        createTimesheet(newTimesheet)
        .then(res => {
            setSaving(-1);
            props.reload();
        }, err => {
            props.setError(err.message);
        })
    }

    const handleCancel = () => {
        setEditting(-1);
    }

    const handleChange = (event: any) => {
        setToSave(event.target.value);
    }

    let userTimesheets = props.times.find((t: any) => t.user === props.user.id);
    let week = props.week.map((w: any) => {
    let day = userTimesheets?.times.find((ut: any) => ut.date === w.date);
        return {
            ...w,
            time: day?.time ?? 0,
            clocks: day?.clock ?? [],
        }
    })

    return (
        <>
        {week.map((weekDay: any) => (
            <Grid 
            onMouseEnter={() => handleSetVisible(weekDay.number)}
            onMouseLeave={handleSetHidden}
            item xs={1} display="flex" justifyContent={'center'} alignItems="center" sx={{backgroundColor:'#F3F5F8B2'}} borderRight="1px solid #E9EDEF" key={weekDay.number}>
                {weekDay.time !== 0 && 
                    <Stack width={'100%'} alignItems="center">
                    {editting === weekDay.number &&
                    <Box
                    width={'100%'} display="flex" justifyContent={'right'}
                    >
                        <IconButton onClick={handleCancel}><Close color='primary' /></IconButton>
                        <IconButton onClick={() => handleSave(weekDay.number, weekDay.date)}><Save color='primary' /></IconButton>
                    </Box>
                    }
                    {editting !== weekDay.number && editVisible === weekDay.number &&
                        <Box
                        width={'100%'} display="flex" justifyContent={'right'}
                        >
                            <IconButton onClick={() => handleEditting(weekDay.number)}><Edit color='primary' /></IconButton>
                        </Box>
                    }
                    {saving === weekDay.number &&
                        <Box
                        width={'100%'} display="flex" justifyContent={'right'}
                        >
                            <CircularProgress/>
                        </Box>
                    }
                    {editting !== weekDay.number && 
                        <Typography
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        >{Math.floor(weekDay.time/60) < 10 ? 0 : ''}{Math.floor(weekDay.time/60)}:{weekDay.time%60 < 10 ? 0 : ''}{weekDay.time%60}
                        </Typography>
                    }
                    {editting === weekDay.number && <TextField type={'number'} onChange={handleChange} defaultValue={(weekDay.time/60).toFixed(2)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />}
                    
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                        pointerEvents: 'none',
                        backgroundColor: 'transparent'
                        }}
                        open={isOpen}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Box p={3}>
                            {weekDay.overided ? <Typography>Overrided: {Math.floor(weekDay.time/60) < 10 ? 0 : ''}{Math.floor(weekDay.time/60)}:{weekDay.time%60 < 10 ? 0 : ''}{weekDay.time%60}</Typography> : null}
                            {weekDay.clocks.map((clock: any) => (
                                <Stack key={clock.time} direction={'row'} spacing={1}>
                                    <Typography color={'primary'}>{clock.type === 'clock-in' ? 'Clocked in: ' : 'Clocked out: '}</Typography>
                                    <Typography>{dayjs(clock.time).format("h:mma")}</Typography>
                                </Stack>
                            ))}
                        </Box>
                    </Popover>
                    </Stack>
                }
                {weekDay.time === 0 && 
                <Stack width={'100%'} alignItems="center">
                    {editting === weekDay.number &&
                    <Box
                    width={'100%'} display="flex" justifyContent={'right'}
                    >
                        <IconButton onClick={handleCancel}><Close color='primary' /></IconButton>
                        <IconButton onClick={() => handleSave(weekDay.number, weekDay.date)}><Save color='primary' /></IconButton>
                    </Box>
                    }
                    {editting !== weekDay.number && editVisible === weekDay.number &&
                        <Box
                        width={'100%'} display="flex" justifyContent={'right'}
                        >
                            <IconButton onClick={() => handleEditting(weekDay.number)}><Edit color='primary' /></IconButton>
                        </Box>
                    }
                    {saving === weekDay.number &&
                        <Box
                        width={'100%'} display="flex" justifyContent={'right'}
                        >
                            <CircularProgress/>
                        </Box>
                    }
                    {editting !== weekDay.number && <Typography>-</Typography>}
                    {editting === weekDay.number && <TextField type={'number'} onChange={handleChange} defaultValue={0}  sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />}
                </Stack>
                 }
                
            </Grid>
        ))}
        </>
    )
}

function Timesheets(props: any) {
    const [date, setDate] = useState(dayjs());
    const [week, setWeek] = useState(
        ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((day, index) => {
            return {
                day: day,
                number: dayjs().startOf('week').add(index, 'days').date(),
                date: dayjs().startOf('week').add(index, 'days').format("MM/DD/YYYY"),
            }
        })
    );
    const [times, setTimes] = useState([] as any);
    const [clockedIn, setClockedIn] = useState(false);
    const [users, setUsers] = useState([] as any);
    const [reload, setReload] = useState(false);
    const [error, setError] = useState(null);

    const handleDateChange = (event: any) => {
        setDate(event);
        let weekList = [] as any[];
        ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].forEach((day, index) => {
            weekList.push({
                day: day,
                number: dayjs(event).startOf('week').add(index, 'days').date(),
                date: dayjs(event).startOf('week').add(index, 'days').format("MM/DD/YYYY"),
            })
        })
        setWeek(weekList);
    }

    const handleClockIn = () => {
        setClockedIn(true);
        clock({type: 'clock-in'})
        .then(_ => {
        }, err => {
            setError(err.message);
        })
    }

    const handleClockOut = () => {
        setClockedIn(false);
        clock({type: 'clock-out'})
        .then(_ => {
        }, err => {
            setError(err.message);
        })
    }

    const reloadTimes = () => {
        setReload(!reload)
    }

    useEffect(() => {
        getClockStatus()
        .then(res => {
            if (!res?.type) return;
            if (res?.type === 'clock-in') {
                setClockedIn(true);
            } else {
                setClockedIn(false);
            }
        }, err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        listTimesheets(dayjs(date).format("YYYY-MM-DD"))
        .then(res => {
            setTimes(res);
        }, err => {
            console.log(err);
        })
    }, [clockedIn, reload, date])

    useEffect(() => {
        listUsers()
        .then(res => {
            setUsers(res)
        }, err => {
            console.log(err);
        })
    }, [])

    if (props.subscription.subscription === 'basic') {
        return(
        <Card sx={{padding: 5}}>
          <Box borderRadius={'15px'} overflow={'hidden'}>
          <a href="/settings?tab=billing">
            <img src="https://res.cloudinary.com/dtjqpussy/image/upload/v1676493884/Untitled_design_1_zz1971.png"
            width={'100%'} alt="upgrade for timesheets"></img>
            </a>
          </Box>
          </Card>
        );
      }


    return (
        <Card sx={{ py: 3 }}>
            <Stack>
                <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                    <Typography variant="h6" fontWeight={600}>Timesheets</Typography>
                    {clockedIn &&
                        <Button onClick={handleClockOut} color='error' variant='contained'>
                        Clock out
                        </Button>
                    }
                    {!clockedIn &&
                        <Button onClick={handleClockIn} variant='contained'>
                        Clock in
                        </Button>
                    }
                    <DatePicker
                    renderInput={(params) => <TextField {...params} />}
                    onChange={handleDateChange}
                    value={date}
                    />
                </Stack>
                <Divider sx={{my:3}}/>
                <Grid container columns={8} pb={2}>
                    <Grid item xs={1}>
                        <Typography color={'neutral.light'}>Employee</Typography>
                    </Grid>
                    {week.map((weekDay: any) => (
                        <Grid item xs={1} key={weekDay.number}>
                            <Stack alignItems={'center'}>
                                <Typography color={'neutral.light'}>{weekDay.day}</Typography>
                                <Typography>{weekDay.number}</Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
                {users.map((user: any) => (
                    <Grid container columns={8} borderTop="1px solid #E9EDEF" key={user.id}>
                        <Grid item xs={1} py={2}>
                            <Typography>{user.first}</Typography>
                            <Typography color={'neutral.light'}>{sumTimeForWeek(user, times)}</Typography>
                        </Grid>
                        <Week week={week} user={user} times={times} reload={reloadTimes} setError={setError} />
                    </Grid>
                ))}
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
        </Card>
    )
}

export default Timesheets;