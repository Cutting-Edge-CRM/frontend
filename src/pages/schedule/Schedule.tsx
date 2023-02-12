import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { Box, Card, Divider, Grid, List, ListItem, ListItemProps, Stack, styled, Typography } from '@mui/material'
import { ButtonTextCompoundInput, EventApi, FormatterInput, ToolbarInput } from '@fullcalendar/core'
import { listVisitsForCalendar, updateVisit } from '../../api/visit.api'
import EmptyState from '../../shared/EmptyState'
import dayjs from 'dayjs'
import { EventImpl } from '@fullcalendar/core/internal'


const StyledUnscheduledVisitContainer = styled(ListItem)<ListItemProps>(({ theme }) => ({
    backgroundColor: theme.palette.blue.main,
    borderRadius: '10px',
    marginTop: theme.spacing(2),
    paddingRight: 0,
    borderLeft: '6px solid',
    borderColor: theme.palette.blue.dark,
    cursor: 'pointer'
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
    const [externalUI, setExternalUI] = useState([] as any);
    const [error, setError] = useState(null);
    const [update, setUpdate] = useState(false);
    let calendarRef = React.createRef<FullCalendar>();

    const toolbar: ToolbarInput = {
        start: "prev,next",
        center: "title",
        end: "dayGridWeek,dayGridMonth"
    }
    const title: FormatterInput = { month: 'long', day: 'numeric'}
    const buttons: ButtonTextCompoundInput = {month: 'Month', week: 'Week'}

    const handleEventEdit = (info: any) => {
        
        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            start: dayjs(info.event.start).toISOString(),
            end: info.event.end ? dayjs(info.event.end).toISOString() : dayjs(info.event.start).toISOString(),
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        // retrieve formatted event from calendars state to add to our react state
        let events = calendarRef.current?.getApi().getEvents() as EventApi[];
        let eventToAdd = events.find((ev: any) => ev.extendedProps.id === info.event.extendedProps.id) as EventImpl;

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

        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            unscheduled: false,
            start: dayjs(info.event.start).toISOString(),
            end: dayjs(info.event.start).toISOString() // event wont have end after dropped
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        // retrieve formatted event from calendars state to add to our react state
        let events = calendarRef.current?.getApi().getEvents() as EventApi[];
        let event = events.find((ev: any) => ev.extendedProps.id === info.event.extendedProps.id) as EventImpl;
        event.setExtendedProp('unscheduled', false);

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
            display: 'block'
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
                <StyledUnscheduledVisitContainer key={visit.id} className="draggable" id={visit.id}>
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