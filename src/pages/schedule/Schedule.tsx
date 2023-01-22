import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Card, Divider, Grid, Stack, Typography } from '@mui/material'
import { ButtonTextCompoundInput, FormatterInput, ToolbarInput } from '@fullcalendar/core'

export default function Schedule(props: any) {

    const events = [
        {
        id: "1",
        allDay: true,
        start: "2023-01-01",
        end: "2023-01-04",
        title: "Interior - 72h",
        editable: true,
        startEditable: true,
        durationEditable: true,

        },
    ]

    const toolbar: ToolbarInput = {
        start: "prev,next",
        center: "title",
        end: "dayGridWeek,dayGridMonth"
    }
    const title: FormatterInput = { month: 'long', day: 'numeric'}
    const buttons: ButtonTextCompoundInput = {month: 'Month', week: 'Week',}

    return (
    <Card>
        <Typography>Schedule</Typography>
        <Divider/>
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                headerToolbar={toolbar}
                titleFormat={title}
                buttonText={buttons}
                events={events}
                />
            </Grid>
            <Grid item xs={3}>
                <Stack>
                    <Typography>Unscheduled</Typography>
                    <Card>
                        <Typography>Appointment</Typography>
                        <Typography>Jane Smith</Typography>
                    </Card>
                    <Card>
                        <Typography>Interior - 18h</Typography>
                        <Typography>Michael Scott</Typography>
                    </Card>
                </Stack>
            </Grid>
        </Grid>

    </Card>
    )
}