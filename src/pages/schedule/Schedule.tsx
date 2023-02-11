import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import { Box, Card, Divider, Grid, List, ListItem, ListItemProps, Stack, styled, Typography } from '@mui/material'
import { ButtonTextCompoundInput, FormatterInput, ToolbarInput } from '@fullcalendar/core'
import { listVisitsForCalendar, updateVisit } from '../../api/visit.api'
import EmptyState from '../../shared/EmptyState'
import dayjs from 'dayjs'


const StyledUnscheduledVisitContainer = styled(ListItem)<ListItemProps>(({ theme }) => ({
    backgroundColor: theme.palette.blue.main,
    borderRadius: '10px',
    marginTop: theme.spacing(2),
    paddingRight: 0,
    borderLeft: '6px solid',
    borderColor: theme.palette.blue.dark,
  }));

const eventRender = (args: any) => {

    if (args.event.display === 'block') {
        return (
            <Stack direction={'row'}>
                <Typography ml={1}>{args.event.extendedProps.type}</Typography>
                <Typography ml={3} color="neutral.main">{args.event.extendedProps.clientName}</Typography>
            </Stack>
        )
    } else {
        return (
            <Stack direction={'row'} alignItems="center" spacing={1}>
                <Typography className="fc-daygrid-event-dot" borderColor={args.event.textColor}></Typography>
                <Stack spacing={-0.5}>
                    <Typography fontWeight={500} fontSize={12} color={args.event.textColor}>{dayjs(args.event.start).format("H:MMA")}</Typography>
                    <Typography fontWeight={400} fontSize={12} color="neutral.main">{args.event.extendedProps.clientName}</Typography>
                </Stack>
            </Stack>
        );
    }

}

export default function Schedule(props: any) {
    const [scheduledEvents, setScheduledEvents] = useState([] as any);
    const [unscheduledEvents, setUnscheduledEvents] = useState([] as any);
    const [error, setError] = useState(null);

    const toolbar: ToolbarInput = {
        start: "prev,next",
        center: "title",
        end: "dayGridWeek,dayGridMonth"
    }
    const title: FormatterInput = { month: 'long', day: 'numeric'}
    const buttons: ButtonTextCompoundInput = {month: 'Month', week: 'Week'}

    const handleEventEdit = (info: any) => {
        let visit = {
            ...info.event.extendedProps,
            start: dayjs(info.event.start).toISOString(),
            end: dayjs(info.event.end).toISOString()
        };
        updateVisit(visit)
        .then((_) => {},
            (err) => {
              setError(err.message);
            }
          );
    }

    useEffect(() => {
        listVisitsForCalendar()
        .then(visits => {
            console.log(visits);
            setScheduledEvents(visits.filter((v: any) => !v.unscheduled));
            setUnscheduledEvents(visits.filter((v: any) => v.unscheduled));
        }, err => {
            setError(err.message);
        })
    }, [])

    return (
    <Card>
        <Typography>Schedule</Typography>
        <Divider/>
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Box sx={{
                    '.fc-h-event': {
                        height: '40px',
                        borderWidth: '0px 0px 0px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'scroll'
                      },
                }}>
                    <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView="dayGridMonth"
                    headerToolbar={toolbar}
                    titleFormat={title}
                    buttonText={buttons}
                    events={scheduledEvents}
                    eventContent={eventRender}
                    eventDrop={handleEventEdit}
                    eventResize={handleEventEdit}
                    />
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Typography fontSize={18} fontWeight={500} color="primary">Unscheduled</Typography>
            <List>
            {unscheduledEvents.map((visit: any) => (
                <StyledUnscheduledVisitContainer key={visit.id}>
                    <Stack spacing={0} my={0}>
                        <Typography fontSize={18} fontWeight={500} color="blue.dark">{visit.type}</Typography>
                        <Typography>{visit.clientName}</Typography>
                    </Stack>
                </StyledUnscheduledVisitContainer>
            ))}
            {unscheduledEvents.length === 0 && (
                <EmptyState type="visits"/>
            )}
            </List>
            </Grid>
        </Grid>

    </Card>
    )
}