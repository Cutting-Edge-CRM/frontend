import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Alert, Box, Card, Divider, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Popover, Stack, Typography, useMediaQuery } from '@mui/material'
import { ButtonTextCompoundInput, EventApi, ToolbarInput } from '@fullcalendar/core'
import { listVisitsForCalendar, updateVisit } from '../../api/visit.api'
import EmptyState from '../../shared/EmptyState'
import dayjs from 'dayjs'
import { EventImpl } from '@fullcalendar/core/internal'
import { theme } from '../../theme/theme'
import VisitModal from './VisitModal'
import { ArrowCircleLeft, CalendarMonthOutlined, Download, Fullscreen, MoreVertOutlined } from '@mui/icons-material'
import ExportCalendarModal from './ExportCalendar'
import { isAllowed } from '../../auth/FeatureGuards'
import NewEvent from '../../shared/NewEvent'

const eventRender = (args: any) => {

    if (args.event.display === 'block') {
        return (
            <Stack direction={'row'}>
                <Typography ml={1}>{args.event.extendedProps.type}</Typography>
                {args.event.extendedProps.hours?.length > 0 && <Typography ml={1}>{`(${args.event.extendedProps.hours} hours)`}</Typography>}
                <Typography ml={3} color="neutral.main">{args.event.extendedProps.clientName !== "No name" ? args.event.extendedProps.clientName : ''}</Typography>
            </Stack>
        )
    } else {
        return (
            <Stack direction={'row'} alignItems="center" spacing={1}>
                <Typography className="fc-daygrid-event-dot" borderColor={args.event.textColor} visibility={args.view?.type === "listMonth" ? 'hidden' : 'visible'} ></Typography>
                <Stack spacing={-0.5}>
                    <Typography fontWeight={500} fontSize={12} color={args.event.textColor}>{dayjs(args.event.start).format("h:mma")}</Typography>
                    <Typography fontWeight={400} fontSize={12} color="neutral.main">{args.event.extendedProps.clientName !== "No name" ? args.event.extendedProps.clientName : args.event.extendedProps.type}</Typography>
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
    const [open, setOpen] = useState(false);
    const [visit, setVisit] = useState({} as any);
    const [users, setUsers] = useState([] as any[]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);
    // eslint-disable-next-line
    const [mobile, _] = useState(useMediaQuery(theme.breakpoints.down("sm")));
    const [drawerOpen, setDrawerOpen] = useState(!useMediaQuery(theme.breakpoints.down("sm")));
    const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
    const isOpenMenu = Boolean(anchorElMenu);
    const [exportCalendarOpen, setExportCalendarOpen] = useState(false);
  
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }  
    
    const handleMouseEnter = (info: any) => {
        setVisit(info.event.extendedProps);
        let action: React.SetStateAction<HTMLElement | null> = info.el;
        setAnchorEl(action);
    }
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const toolbar: ToolbarInput = {
        start: "prev,next",
        center: "title",
        end: "listMonth,dayGridYear"
    }
    // const title: FormatterInput = { year: 'numeric' }
    const buttons: ButtonTextCompoundInput = {list: 'List', year: 'Year'}

    const viewOptions = {
        dayGridYear: {
            titleFormat: { year: 'numeric' }
          }
    }

    const handleClose = () => {
        setOpen(false);
      };

    const handleEventEdit = (info: any) => {
        
        // create visit to save to db
        let visit = {
            ...info.event.extendedProps,
            start: dayjs(info.event.start).toISOString(),
            end: info.event.end ? dayjs(info.event.end).subtract(1, 'day').toISOString() : dayjs(info.event.start).toISOString(),
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
            anytime: true,
            allDay: true,
            start: dayjs(info.event.start).toISOString(),
            end: dayjs(info.event.start).toISOString() // event wont have end after dropped
        };
        delete visit._context;
        delete visit._def;
        delete visit._instance;

        // save to db
        updateVisit(visit)
        .then((_) => {
            setUpdate(!update);
        },
            (err) => {
                setError(err.message);
            }
            );

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

    }

    const handleEventDragStop = (info: any) => {

        setAnchorEl(null);
        
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

    const handleEventClick = (info: any) => {
        setVisit(info.event.extendedProps);
        setUsers(info.event.extendedProps.users);
        setOpen(true);
    }

    const handleUnscheduledEventClick = (visit: any) => {
        setVisit(visit);
        setUsers(visit.users);
        setOpen(true);
    }

    const openMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElMenu(event.currentTarget);
      };

    const closeMenu = () => {
        setAnchorElMenu(null);
    }

    const openExportCalendarModal = () => {
        setExportCalendarOpen(true);
    }

    const closeExportCalendar = () => {
        setExportCalendarOpen(false);
    }

    const [newEventOpen, setNewEventOpen] = useState(false);
    const handleNewEvent = () => {
      setNewEventOpen(true);
    }
    const handleCloseEvent = () => {
      setNewEventOpen(false);
    }

    useEffect(() => {
        listVisitsForCalendar(!isAllowed('view-full-schedule'))
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
            setExternalUI([externalContainer?.offsetTop, (externalContainer?.offsetLeft + externalContainer?.offsetWidth), externalContainer?.offsetTop + externalContainer?.offsetHeight, externalContainer?.offsetLeft]);
        }, err => {
            setError(err.message);
        })
    }, [update, props.reload, newEventOpen])

    useEffect(() => {
        let els = Array.from(document.getElementsByClassName("draggable"));
        els.forEach(d => {
            new Draggable((d as HTMLElement), {
                eventData: function(el) {
                    let event = unscheduledEvents.find((event: any) => +event.id === +d.id);
                    return {
                        ...event,
                    }
                }
            });
        })
    }, [unscheduledEvents])

    if (!isAllowed('team-feature')) {
        return(
        <Card sx={{padding: 5}}>
          <Box borderRadius={'15px'} overflow={'hidden'}>
            <a href="/settings?tab=billing">
            <img src="https://res.cloudinary.com/dtjqpussy/image/upload/v1676493489/Effortlessly_Schedule_Jobs_and_Staff_l4s9gc.png"
            width={'100%'} alt="upgrade for visits"></img>
            </a>
          </Box>
          </Card>
        );
      }

    return (
    <Card sx={{py: 2, height: '100vh' }} >
        
        <Stack direction={'row'} justifyContent="space-between">
            <Typography fontSize={20} fontWeight={600} mb={2}>Schedule</Typography>
            <Stack direction={'row'}>
                <IconButton onClick={openMoreMenu}>
                    <MoreVertOutlined color='primary' />
                </IconButton>
                <Menu
                id="dropdown-menu"
                anchorEl={anchorElMenu}
                open={isOpenMenu}
                onClose={closeMenu}
                >
                <MenuList onClick={handleNewEvent}>
                    <MenuItem>
                    <ListItemIcon>
                        <CalendarMonthOutlined />
                    </ListItemIcon>
                    <ListItemText>New Event</ListItemText>
                    </MenuItem>
                </MenuList>
                <MenuList onClick={openExportCalendarModal}>
                    <MenuItem>
                    <ListItemIcon>
                        <Download />
                    </ListItemIcon>
                    <ListItemText>Export Calendar</ListItemText>
                    </MenuItem>
                </MenuList>
                </Menu>
                <IconButton onClick={toggleDrawer}>
                    {!drawerOpen && <ArrowCircleLeft color='primary' fontSize='large'/>}
                    {drawerOpen && <Fullscreen color='primary' fontSize='large' />}
                </IconButton>
            </Stack>
        </Stack>
        
        <Divider sx={{mb: 2}} />
        <Grid container spacing={2} height="100%" >
            <Grid item xs={mobile ? (drawerOpen ? 0 : 12) : (drawerOpen ? 9 : 12)} display={(mobile && drawerOpen) ? 'none' : 'block'} >
                <Box  height="100%" sx={{
                    fontFamily: "'Poppins', sans-serif",
                    '.fc-h-event': {
                        height: '40px',
                        borderWidth: '0px 0px 0px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'scroll',
                        '::-webkit-scrollbar': {
                            display: 'none'
                        }
                      },
                    '.fc-header-toolbar': {
                        color: "neutral.main",
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
                    },
                    '.fc-button-primary:focus': {
                        boxShadow: 'none !important'
                    },
                    '.fc': {
                        height: '100%',
                    },
                    '.fc-list-event': {
                        display: 'block'
                    },
                    '.fc-daygrid-month-start': {
                        fontSize: '0.8rem',
                        textAlign: 'end',
                        overflowWrap: 'anywhere'
                    }
                }}>
                    <FullCalendar
                    plugins={[ listPlugin, dayGridPlugin, interactionPlugin ]}
                    initialView={mobile ? "listMonth" : "dayGridYear"}
                    headerToolbar={toolbar}
                    // titleFormat={title}
                    buttonText={buttons}
                    titleFormat={{year: 'numeric'}}
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
                    eventClick={handleEventClick}
                    eventMouseEnter={handleMouseEnter}
                    eventMouseLeave={handlePopoverClose}
                    />
                </Box>
                <Popover
                    id="mouse-over-popover"
                    sx={{
                    pointerEvents: 'none',
                    backgroundColor: 'transparent'
                    }}
                    open={isOpen && !mobile}
                    anchorEl={anchorEl ?? undefined}
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
                    PaperProps={{sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    }}}
                >
                    <Box sx={{
                        backgroundColor: theme.palette.info.light,
                        borderRadius: '10px',
                        mt: 1,
                        py: 1,
                        pl: 1,
                        minWidth: '300px'
                    }}>
                    <Grid container spacing={2}>
                        <Grid item={true} xs={2} alignSelf="center">
                        <CalendarMonthOutlined color="primary" fontSize='large' />
                        </Grid>
                        <Grid item={true} xs={8}>
                        <Stack>
                            <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ opacity: 0.7 }}
                            >
                            {visit.type}
                            </Typography>
                            <Typography variant="caption">{visit.address}</Typography>
                            {visit.unscheduled === (1 || true) ?
                            <Typography
                                color="primary"
                                variant="caption"
                                fontWeight={500}
                                >
                                Unscheduled
                                </Typography>
                            :
                            <>
                            {dayjs(visit.start).diff(dayjs(visit.displayEnd), 'hours') < 24 &&
                            dayjs(visit.start).diff(dayjs(visit.displayEnd), 'hours') > -24 ? (
                            // if start and end within 1 day of eachother
                            visit.anytime === (1 || true) ? (
                                // if anytime: Jan 13
                                <Typography
                                color="primary"
                                variant="caption"
                                fontWeight={500}
                                >
                                {dayjs(visit.start).format('MMM D')} - Anytime
                                </Typography>
                            ) : (
                                // if not anytime: Jan 13 4:30pm - 6:00pm
                                <Typography
                                color="primary"
                                variant="caption"
                                fontWeight={500}
                                >
                                {dayjs(visit.start).format('MMM D')}{' '}
                                {dayjs(visit.start).format('h:mma')} -{' '}
                                {dayjs(visit.displayEnd).format('h:mma')}
                                </Typography>
                            )
                            ) : (
                            // if start and end not within 1 day of eachother: Jan 13 - Jan 16
                            <Typography
                                color="primary"
                                variant="caption"
                                fontWeight={500}
                            >
                                {dayjs(visit.start).format('MMM D')} -{' '}
                                {dayjs(visit.displayEnd).format('MMM D')}
                            </Typography>
                            )}                    
                            </>
                            }
                            <Typography
                            variant="caption"
                            fontStyle="italic"
                            sx={{ opacity: 0.8 }}
                            >
                            {visit.users
                                ?.map((user: any) =>
                                user.name ? user.name : user.email
                                )
                                .join(', ')}
                            </Typography>
                        </Stack>
                        </Grid>
                    </Grid>
                    </Box>
                </Popover>
            </Grid>
            <Grid item xs={mobile ? (drawerOpen ? 12 : 0) : (drawerOpen ? 3 : 0)} display={drawerOpen ? 'block' : 'none'} id="unscheduled-container">
                <Typography fontSize={18} fontWeight={500} color="primary">Unscheduled</Typography>
            <List>
            {unscheduledEvents.map((visit: any, index: number) => (
                <ListItemButton 
                    key={visit.id} 
                    onClick={() => handleUnscheduledEventClick(visit)}
                    className="draggable" id={visit.id} sx={{
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
                        <Stack direction={'row'} alignItems="center">
                        <Typography fontSize={18} fontWeight={500} color={visit.textColor}>{visit.type}</Typography>
                        {visit.hours?.length > 0 && <Typography variant='body2' fontWeight={300} ml={1}>{`(${visit.hours} hours)`}</Typography>}
                        </Stack>
                        <Typography>{visit.clientName}</Typography>
                    </Stack>
                </ListItemButton>
            ))}
            {unscheduledEvents.length === 0 && (
                <EmptyState type="unscheduled"/>
            )}
            </List>
            </Grid>
        </Grid>
        <VisitModal
        visit={visit}
        setVisit={setVisit}
        open={open}
        onClose={handleClose}
        users={users}
        success={props.success}
        reload={update}
        setReload={setUpdate}
      />
      <ExportCalendarModal
      open={exportCalendarOpen}
      onClose={closeExportCalendar}
      />
        <NewEvent
        open={newEventOpen}
        onClose={handleCloseEvent}
        success={props.success}
      />
      {error && <Alert severity="error">{error}</Alert>}
    </Card>
    )
}