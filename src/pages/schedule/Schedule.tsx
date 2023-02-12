import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { Box, Card, Divider, Grid, List, Stack, Typography } from '@mui/material'
import { ButtonTextCompoundInput, EventApi, FormatterInput, ToolbarInput } from '@fullcalendar/core'
import { listVisitsForCalendar, updateVisit } from '../../api/visit.api'
import EmptyState from '../../shared/EmptyState'
import dayjs from 'dayjs'
import { EventImpl } from '@fullcalendar/core/internal'
import { theme } from '../../theme/theme'


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
                    <Typography fontWeight={500} fontSize={12} color={args.event.textColor}>{dayjs(args.event.start).format("h:mma")}</Typography>
                    <Typography fontWeight={400} fontSize={12} color="neutral.main">{args.event.extendedProps.clientName}</Typography>
                </Stack>
            </Stack>
        );
    }

}

export default function Schedule(props: any) {
    const [scheduledEvents, setScheduledEvents] = useState([] as any);
    const [unscheduledEvents, setUnscheduledEvents] = useState([] as any);
    const [externalUI, setExternalUI] = useState([] as any);
    const [error, setError] = useState(null);
    const [update, setUpdate] = useState(false);
    let calendarRef = React.createRef<FullCalendar>();

    const toolbar: ToolbarInput = {
        start: "prev,next",
        center: "title",
        end: "dayGridWeek,dayGridYear"
    }
    // const title: FormatterInput = { year: 'numeric' }
    const buttons: ButtonTextCompoundInput = {year: 'Year', week: 'Week'}

    const viewOptions = {
        dayGridYear: {
            titleFormat: { year: 'numeric' }
          },
        dayGridWeek: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
        }
    }

    const handleEventEdit = (info: any) => {


        console.log(info.event);
        
        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            start: dayjs(info.event.start).toISOString(),
            end: info.event.end ? dayjs(info.event.end).toISOString() : dayjs(info.event.start).toISOString(),
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        console.log(visit);

        // retrieve formatted event from calendars state to add to our react state
        let events = calendarRef.current?.getApi().getEvents() as EventApi[];
        let eventToAdd = events.find((ev: any) => ev.extendedProps.id === info.event.extendedProps.id) as EventImpl;
        console.log(eventToAdd);

        // get index of event in our react state to remove
        let eventToRemove = scheduledEvents.find((ev: any) => ev.id === info.event.extendedProps.id);
        let eventIndex = scheduledEvents.indexOf(eventToRemove);

        // replace our react state event with calendars state event
        setScheduledEvents(scheduledEvents.slice(undefined, eventIndex).concat(scheduledEvents.slice(eventIndex + 1, undefined)).concat(eventToAdd));

        // save to db
        updateVisit(visit)
        .then((_) => {
            setUpdate(!update);
        },
            (err) => {
              setError(err.message);
            }
          );
    }

    const handleReceiveEvent = (info: any) => {

        console.log(info);

        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            unscheduled: false,
            anytime: true,
            allDay: true,
            start: dayjs(info.event.start).toISOString(),
            end: dayjs(info.event.start).add(1, 'day').toISOString() // event wont have end after dropped
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        // retrieve formatted event from calendars state to add to our react state
        let events = calendarRef.current?.getApi().getEvents() as EventApi[];
        let event = events.find((ev: any) => ev.extendedProps.id === info.event.extendedProps.id) as EventImpl;
        event.setExtendedProp('unscheduled', false);
        event.setExtendedProp('allDay', true);

        // add event to our react state
        setScheduledEvents(scheduledEvents.concat(event));

        // get event index to remove from  unscheduled state
        let unscheduledEvent = unscheduledEvents.find((ev: any) => ev.id === info.event.extendedProps.id);
        let eventIndex = unscheduledEvents.indexOf(unscheduledEvent);

        // remove  our unscheduled state
        setUnscheduledEvents(unscheduledEvents.slice(undefined, eventIndex).concat(unscheduledEvents.slice(eventIndex + 1, undefined)));


        // save to db
        updateVisit(visit)
        .then((_) => {
            setUpdate(!update);
        },
            (err) => {
              setError(err.message);
            }
          );
    }

    const handleEventDragStop = (info: any) => {
        
        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            unscheduled: true,
            display: 'block',
            backgroundColor: info.event.backgroundColor,
            textColor: info.event.textColor,
            borderColor: info.event.borderColor,
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        // if dropped on external UI, add to unscheduled
        if (info.jsEvent.x > externalUI[3] && info.jsEvent.x < externalUI[1] && info.jsEvent.y > externalUI[0] && info.jsEvent.y < externalUI[2]) {
            
            // get event index to remove from our react state
            let event = scheduledEvents.find((ev: any) => ev.id === info.event.extendedProps.id);
            let eventIndex = scheduledEvents.indexOf(event);

            // remove from our react state
            setScheduledEvents(scheduledEvents.slice(undefined, eventIndex).concat(scheduledEvents.slice(eventIndex + 1, undefined)));


            // add visit to unscheduled state
            console.log(visit);
            setUnscheduledEvents(unscheduledEvents.concat(visit));

            // save to db
            updateVisit(visit)
            .then((_) => {
                setUpdate(!update);
            },
                (err) => {
                setError(err.message);
                }
            );
        }
    }

    useEffect(() => {
        listVisitsForCalendar()
        .then(visits => {
            setScheduledEvents(visits.filter((v: any) => !v.unscheduled));
            let unscheduled = visits.filter((v: any) => v.unscheduled)
            setUnscheduledEvents(unscheduled);
            let els = Array.from(document.getElementsByClassName("draggable"));
            els.forEach(d => {
                new Draggable((d as HTMLElement), {
                    eventData: function(el) {
                        let event = unscheduled.find((event: any) => +event.id === +d.id);
                        return {
                            ...event,
                        }
                    }
                });
            })
            let externalContainer = document.getElementById("unscheduled-container") as HTMLElement;
            setExternalUI([externalContainer?.offsetTop, (externalContainer?.offsetLeft + externalContainer?.offsetWidth), externalContainer.offsetTop + externalContainer.offsetHeight, externalContainer.offsetLeft]);
        }, err => {
            setError(err.message);
        })
    }, [update])

    return (
    <Card sx={{py: 2}} >
        <Typography fontSize={20} fontWeight={600} mb={2}>Schedule</Typography>
        <Divider sx={{mb: 2}} />
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Box sx={{
                    fontFamily: "'Poppins', sans-serif",
                    '.fc-h-event': {
                        height: '40px',
                        borderWidth: '0px 0px 0px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'scroll'
                      },
                    '.fc-header-toolbar': {
                        color: "neutral.main"
                    },
                    '.fc-button': {
                        backgroundColor: 'white',
                        color: `${theme.palette.primary.main}`,
                        borderColor: `${theme.palette.primary.main} !important`,
                    },
                    '.fc-button-active': {
                        backgroundColor: `${theme.palette.primary.main} !important`,
                    },
                    '.fc-button-primary:hover': {
                        backgroundColor: `${theme.palette.primary.main} !important`,
                    }
                }}>
                    <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView="dayGridYear"
                    headerToolbar={toolbar}
                    // titleFormat={title}
                    buttonText={buttons}
                    views={{viewOptions}}
                    events={scheduledEvents}
                    eventContent={eventRender}
                    eventDrop={handleEventEdit}
                    eventResize={handleEventEdit}
                    droppable={true}
                    eventReceive={handleReceiveEvent}
                    eventDragStop={handleEventDragStop}
                    dragRevertDuration={0}
                    editable={true}
                    ref={calendarRef}
                    />
                </Box>
            </Grid>
            <Grid item xs={3} id="unscheduled-container">
                <Typography fontSize={18} fontWeight={500} color="primary">Unscheduled</Typography>
            <List>
            {unscheduledEvents.map((visit: any) => (
                <Box key={visit.id} className="draggable" id={visit.id} sx={{
                    backgroundColor: visit.backgroundColor,
                    borderRadius: '10px',
                    marginTop: 2,
                    paddingRight: 0,
                    paddingLeft: 2,
                    borderLeft: '6px solid',
                    borderColor: visit.textColor,
                    cursor: 'pointer'
                  }}>
                    <Stack spacing={0} my={0}>
                        <Typography fontSize={18} fontWeight={500} color={visit.textColor}>{visit.type}</Typography>
                        <Typography>{visit.clientName}</Typography>
                    </Stack>
                </Box>
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