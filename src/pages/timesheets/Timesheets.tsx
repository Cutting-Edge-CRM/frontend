import { Close, Edit, Save } from '@mui/icons-material';
import { Alert, Box, Button, Card, Checkbox, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, ListItemText, MenuItem, Popover, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { clock, createTimesheet, getClockStatus, listTimesheets } from '../../api/timesheet.api';
import { getUser, listUsers } from '../../api/user.api';
import { theme } from '../../theme/theme';
import { currentUserClaims } from '../../auth/firebase';

function Clock(props: any) {
    const [date, setDate] = useState('');

    useEffect(() => {
        setInterval(
          () => tick(),
          1000
        );
      })

    const tick = () => {
        if (!props.lastClock) {
            return;
        }
        let today = dayjs();
        let seconds = today.diff(dayjs(props.lastClock), 'second') % 60;
        let minutes = today.diff(dayjs(props.lastClock), 'minute') % 60;
        let hours = Math.floor(today.diff(dayjs(props.lastClock), 'hour') / 60);
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return;
        }
        let secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
        let minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
        let hoursString = hours < 10 ? `0${hours}` : `${hours}`
        let timeString = `- ${hoursString}:${minutesString}:${secondsString}`;
        setDate(timeString);
      }
  
      return (<>{date}</>);
  }

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
    const [currentDay, setCurrentDay] = useState({} as any);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, weekDay: any) => {
        setCurrentDay(weekDay);
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

    const handleChangeHour = (event: any) => {
        setToSave(+(toSave%1) + +event.target.value);
    }

    const handleChangeMinute = (event: any) => {
        setToSave((Math.floor(toSave)) + event.target.value/60);
    }

    let userTimesheets = props.times.find((t: any) => t.user === props.user.id);
    let week = props.week.map((w: any) => {
    let day = userTimesheets?.times.find((ut: any) => ut.date === w.date);
        return {
            ...w,
            time: day?.time ?? 0,
            clocks: day?.clock ?? [],
            overrided: day?.overrided
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
                        onMouseEnter={(e) => handlePopoverOpen(e, weekDay)}
                        onMouseLeave={handlePopoverClose}
                        >{Math.floor(weekDay.time/60) < 10 ? 0 : ''}{Math.floor(weekDay.time/60)}:{weekDay.time%60 < 10 ? 0 : ''}{weekDay.time%60}
                        </Typography>
                    }
                    {editting === weekDay.number && 
                    <Stack direction={'row'} alignItems="center">
                        <TextField type={'number'} onChange={handleChangeHour} defaultValue={Math.floor(weekDay.time/60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                        <Typography fontWeight={700} fontSize={"1.5rem"}>:</Typography>
                        <TextField type={'number'} onChange={handleChangeMinute} defaultValue={Math.floor(weekDay.time%60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                    </Stack>
                    }
                    
                    <Popover
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
                            {currentDay?.overrided ? <Typography color={'error'}>Overrided: {Math.floor(currentDay?.time/60) < 10 ? 0 : ''}{Math.floor(currentDay?.time/60)}:{currentDay?.time%60 < 10 ? 0 : ''}{currentDay?.time%60}</Typography> : null}
                            {currentDay?.clocks?.map((clock: any) => (
                                <Grid container key={clock.time} spacing={1}>
                                    <Grid item xs={8}>
                                        <Typography color={'primary'}>{clock.type === 'clock-in' ? 'Clocked in: ' : 'Clocked out: '}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>{dayjs(clock.time).format("h:mma")}</Typography>
                                    </Grid>
                                </Grid>
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
                    {editting === weekDay.number && 
                    <Stack direction={'row'} alignItems="center">
                        <TextField type={'number'} onChange={handleChangeHour} defaultValue={Math.floor(weekDay.time/60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                        <Typography fontWeight={700} fontSize={"1.5rem"}>:</Typography>
                        <TextField type={'number'} onChange={handleChangeMinute} defaultValue={Math.floor(weekDay.time%60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                    </Stack>
                    }
                </Stack>
                 }
                
            </Grid>
        ))}
        </>
    )
}

function SingleUserWeek(props: any) {
    const [editting, setEditting] = useState(-1);
    const [toSave, setToSave] = useState(0);
    const [saving, setSaving] = useState(-1);
    const [currentDay, setCurrentDay] = useState({} as any);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleChangeHour = (event: any) => {
        setToSave(+(toSave%1) + +event.target.value);
    }

    const handleChangeMinute = (event: any) => {
        setToSave((Math.floor(toSave)) + event.target.value/60);
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, weekDay: any) => {
        setCurrentDay(weekDay);
        setIsOpen(true);
      };
  
    const handlePopoverClose = () => {
        setIsOpen(false);
    };

    let userTimesheets = props.times.find((t: any) => t.user === props.user.id);
    let week = props.week.map((w: any) => {
    let day = userTimesheets?.times.find((ut: any) => ut.date === w.date);
        return {
            ...w,
            time: day?.time ?? 0,
            clocks: day?.clock ?? [],
            overrided: day?.overrided
        }
    })
    return (
    <>
    {week.map((weekDay: any) => (
        <Grid container key={weekDay.number} sx={{marginTop: '0px !important', borderTop: "1px solid #E9EDEF"}} >
            <Grid item xs={4} alignSelf="center">
                <Typography color={'neutral.light'}>{weekDay.day}</Typography>
                <Typography>{weekDay.number}</Typography>
            </Grid>
            <Grid 
            item xs={8} 
            display="flex" 
            justifyContent={'center'} 
            alignItems="center" 
            sx={{backgroundColor:'#F3F5F8B2'}} 
            >
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
                    {editting !== weekDay.number &&
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
                    <>
                    <Typography
                        onClick={(e) => handlePopoverOpen(e, weekDay)}
                        >{Math.floor(weekDay.time/60) < 10 ? 0 : ''}{Math.floor(weekDay.time/60)}:{weekDay.time%60 < 10 ? 0 : ''}{weekDay.time%60}
                    </Typography>
                    <Dialog fullScreen={true} onClose={handlePopoverClose} open={isOpen} fullWidth>
                        <IconButton sx={{ justifyContent: 'start' }} onClick={handlePopoverClose} disableRipple>
                            <Close fontSize='large'/>
                        </IconButton>
                        <DialogContent>
                        <Box p={3}>
                            {currentDay?.overrided ? <Typography color={'error'}>Overrided: {Math.floor(currentDay?.time/60) < 10 ? 0 : ''}{Math.floor(currentDay?.time/60)}:{currentDay?.time%60 < 10 ? 0 : ''}{currentDay?.time%60}</Typography> : null}
                            {currentDay?.clocks?.map((clock: any) => (
                                <Grid container key={clock.time} spacing={1}>
                                    <Grid item xs={8}>
                                        <Typography color={'primary'}>{clock.type === 'clock-in' ? 'Clocked in: ' : 'Clocked out: '}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>{dayjs(clock.time).format("h:mma")}</Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                        </DialogContent>
                    </Dialog>
                    </>
                    }
                    {editting === weekDay.number && 
                    <Stack direction={'row'} alignItems="center">
                        <TextField type={'number'} onChange={handleChangeHour} defaultValue={Math.floor(weekDay.time/60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                        <Typography fontWeight={700} fontSize={"1.5rem"}>:</Typography>
                        <TextField type={'number'} onChange={handleChangeMinute} defaultValue={Math.floor(weekDay.time%60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                    </Stack> 
                    }
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
                    {editting !== weekDay.number &&
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
                    {editting === weekDay.number && 
                    <Stack direction={'row'} alignItems="center">
                        <TextField type={'number'} onChange={handleChangeHour} defaultValue={Math.floor(weekDay.time/60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                        <Typography fontWeight={700} fontSize={"1.5rem"}>:</Typography>
                        <TextField type={'number'} onChange={handleChangeMinute} defaultValue={Math.floor(weekDay.time%60)} sx={{margin: 1, '.MuiInputBase-input': {borderRadius: '20px'}}} />
                    </Stack> 
                    }
                </Stack>
                 }
                
            </Grid>
        </Grid>
    ))}
    </>)
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
    const [currentUser, setCurrentUser] = useState({} as any)
    const [lastClock, setLastClock] = useState(null);
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));


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
            setLastClock(dayjs().format() as any)
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

    const handleChangeUser = (event: any) => {
        setCurrentUser(event.target.value);
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
                setLastClock(res?.time);
            } else {
                setClockedIn(false);
            }
        }, err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        listTimesheets(dayjs(date).format("YYYY-MM-DD"), ((currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') ? false : true) )
        .then(res => {
            setTimes(res);
        }, err => {
            console.log(err);
        })
    }, [clockedIn, reload, date])

    useEffect(() => {
        if (currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') {
            listUsers()
            .then(res => {
                setUsers(res);
                setCurrentUser(res[0]);
            }, err => {
                console.log(err);
            })
        } else {
            getUser()
            .then(res => {
                setUsers([res]);
                setCurrentUser(res);
            }, err => {
                console.log(err);
            })
        }

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
            {!mobile &&
                <Stack>
                <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                    <Typography variant="h6" fontWeight={600}>Timesheets</Typography>
                    {clockedIn &&
                        <Button onClick={handleClockOut} color='error' variant='contained'>
                        Clock out <Clock lastClock={lastClock} />
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
                                <Stack direction={'row'} alignItems={'center'} justifyContent="space-between">
                                    <Typography>{user.first}</Typography>
                                    {/* <Tooltip title="Clock out user">
                                        <IconButton><AccessAlarm color="error"/></IconButton>
                                    </Tooltip> */}
                                </Stack>
                                <Typography color={'neutral.light'}>{sumTimeForWeek(user, times)}</Typography>
                            </Grid>
                            <Week week={week} user={user} times={times} reload={reloadTimes} setError={setError} />
                        </Grid>
                    ))}
            </Stack>
            }
            {mobile &&
                <Stack direction={'column'} justifyContent="space-between" alignItems={'center'} spacing={3}>
                    <Stack direction={'row'} alignItems="center" spacing={2}>
                        <Typography variant="h6" fontWeight={600}>Timesheets</Typography>
                        <DatePicker
                        renderInput={(params) => <TextField {...params} />}
                        onChange={handleDateChange}
                        value={date}
                        />
                    </Stack>
                    <Box width="100%" sx={{ marginBottom: "16px !important"}}>
                    {clockedIn &&
                        <Button onClick={handleClockOut} color='error' variant='contained' sx={{width: "100%"}} >
                        Clock out <Clock lastClock={lastClock} />
                        </Button>
                    }
                    {!clockedIn &&
                        <Button onClick={handleClockIn} variant='contained' sx={{width: "100%"}} >
                        Clock in
                        </Button>
                    }
                    </Box>
                    {((currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner')) &&
                        <Select
                        labelId="user-label"
                        id="user"
                        value={users.find((u: any) => u.id === currentUser.id) ?? ''}
                        displayEmpty={true}
                        onChange={handleChangeUser}
                        sx={{marginBottom: '24px !important'}}
                        renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.name ? selected.name : selected.email}
                        </Box>
                        
                        )}
                    >
                        {users.map((user: any) => (
                        <MenuItem key={user.id} value={user}>
                            <Checkbox checked={user.id === currentUser.id} />
                            <ListItemText primary={user.first} />
                        </MenuItem>
                        ))}
                    </Select>
                    }
                    <SingleUserWeek week={week} user={currentUser} times={times} reload={reloadTimes} setError={setError} />
                </Stack>
            }
            {error && <Alert severity="error">{error}</Alert>}
        </Card>
    )
}

export default Timesheets;