import { Button, Card, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { clock, getClockStatus, listTimesheets } from '../../api/timesheet.api';
import { listUsers } from '../../api/user.api';

function Week(props: any) {

    let userTimesheets = props.times.find((t: any) => t.user === props.user.id);

    let week = props.week.map((w: any) => {

        let day = userTimesheets?.times.find((ut: any) => ut.date === w.date);

        return {
            ...w,
            time: day?.time ?? 0,
        }
    })

    return (
        <>
        {week.map((weekDay: any) => (
            <Grid item xs={1} display="flex" justifyContent={'center'} alignItems="center" sx={{backgroundColor:'#F3F5F8B2'}} borderRight="1px solid #E9EDEF" key={weekDay.number}>
                {weekDay.time !== 0 && <Typography>{Math.floor(weekDay.time/60) < 10 ? 0 : ''}{Math.floor(weekDay.time/60)}:{weekDay.time%60 < 10 ? 0 : ''}{weekDay.time%60}</Typography>}
                {weekDay.time === 0 && <Typography>-</Typography> }
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

    let demoTimes: any = [
        {
            user: 3,
            times: [
                {
                    time: 6.3,
                    date: '02/12/2023',
                    id: 234567,
                    overrided: false,
                    clocks: [
                        {
                            type: 'start',
                            time: '8:02'
                        },
                        {
                            type: 'end',
                            time: '3:55'
                        },
                    ]
                },
            ]
        },
    ];

    const handleDateChange = (event: any) => {
        setDate(event);
        let weekList = [] as any[];
        ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((day, index) => {
            weekList.push({
                day: day,
                number: dayjs(event).startOf('week').add(index, 'days').date(),
                date: dayjs(event).startOf('week').add(index, 'days').format("MM/DD/YYYY"),
            })
        })
        setWeek(weekList);
        console.log(weekList);
    }

    const handleClockIn = () => {
        setClockedIn(true);
        clock({type: 'clock-in'})
        .then(res => {
            console.log(res);
        }, err => {
            console.log(err);
        })
    }

    const handleClockOut = () => {
        setClockedIn(false);
        clock({type: 'clock-out'})
        .then(res => {
            console.log(res);
        }, err => {
            console.log(err);
        })
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
    }, [clockedIn])

    useEffect(() => {
        listTimesheets(dayjs(date).format("YYYY-MM-DD"))
        .then(res => {
            console.log(res);
            setTimes(res)
        }, err => {
            console.log(err);
        })
    }, [clockedIn])

    useEffect(() => {
        listUsers()
        .then(res => {
            console.log(res);
            setUsers(res)
        }, err => {
            console.log(err);
        })
    }, [])


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
                            <Typography color={'neutral.light'}>8:26</Typography>
                        </Grid>
                        <Week week={week} user={user} times={times}/>
                    </Grid>
                ))}
            </Stack>
        </Card>
    )
}

export default Timesheets;