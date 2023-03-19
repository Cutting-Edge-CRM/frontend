import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputLabel,
    Link,
    Stack,
    styled,
    Tab,
    Tabs,
    Typography,
    TypographyProps,
    useMediaQuery,
  } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
  import * as React from 'react';
  import { useEffect, useState } from 'react';
import { getClient } from '../../api/client.api';
import { getJob } from '../../api/job.api';
  import { listProperties } from '../../api/property.api';
import { listUsers } from '../../api/user.api';
import EmptyState from '../../shared/EmptyState';
import { getChipColor, theme } from '../../theme/theme';
import EditVisit from '../../shared/visit/EditVisit';
import { Directions } from '@mui/icons-material';

  function add(accumulator: number, a: number) {
      return +accumulator + +a;
    }

    function getEventColor(type: string) {
      switch (type) {
        case "Job":
          return '#E0FFEF';
        case "Estimate":
          return '#BBBAFBE0';
        case "Task":
          return '#CCF3FF';
        case "Reminder":
          return '#FFC1E5';
      }
    }
    
    function getBorderColor(type: string) {
      switch (type) {
        case "Job":
          return '#00AC4F';
        case "Estimate":
          return '#403DFC';
        case "Task":
          return '#0C8BE7';
        case "Reminder":
          return '#DA001A';
      }
    }
    
  const StyledTypography = styled(Typography)<TypographyProps>(() => ({
    minWidth: 74,
    fontWeight: 400,
    fontSize: 16
  }));
  
  export default function VisitModal(props: any) {
    const [error, setError] = useState(null);
    const [properties, setProperties] = useState([] as any[]);
    const [value, setValue] = useState(0);
    const [client, setClient] = useState({} as any);
    const [job, setJob] = useState({} as any);
    const [users, setUsers] = useState([] as any[]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editVisitOpen, setEditVisitOpen] = useState(false);

    let property = properties.find((p) => p.id === props.visit.property);
    
    const handleCancel = () => {
      props.onClose();
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    const handleEditVisit = () => {
      setEditVisitOpen(true);
    }

    const handleCloseEditVisit = () => {
      setEditVisitOpen(false);
    }

    const handleUpdate = (value: string) => {
      setEditVisitOpen(false);
    };
  
    useEffect(() => {
        if (!props.visit.client) return;
        listProperties(props.visit.client).then(
        (result: any[]) => {
          setProperties(result);
        },
        (err) => {
          setError(err.message);
        }
      );
    }, [props.visit]);

    useEffect(() => {
        if (!props.visit.client) return;
        getClient(props.visit.client).then(
          (result: any) => {
            setClient(result);
          },
          (err) => {
            setError(err.message);
          }
        );
      }, [props.visit]);

    useEffect(() => {
        if (!props.visit.job) return;
        getJob(props.visit.job).then(
          (result: any) => {
            setJob(result);
          },
          (err) => {
            setError(err.message);
          }
        );
      }, [props.visit]);
    
      useEffect(() => {
        listUsers().then(
          (result: any) => {
            setUsers(result);
          },
          (err) => {
            setError(err.message);
          }
        );
      }, []);

      const propertyColumns: GridColDef[] = [
        {
          field: 'address',
          headerName: 'Address',
          headerClassName: 'MuiDataGrid-columnHeader',
          width: 200,
          sortable: false,
        },
        {
          field: 'city',
          headerName: 'City',
          headerClassName: 'MuiDataGrid-columnHeader',
          width: 170,
          sortable: false,
        },
        {
          field: 'state',
          headerName: 'State',
          headerClassName: 'MuiDataGrid-columnHeader',
          width: 170,
          sortable: false,
        },
      ];
  
    return (
      <Dialog fullScreen={useMediaQuery(theme.breakpoints.down("sm"))} onClose={handleCancel} open={props.open} fullWidth>
        <DialogTitle align="center">
          View {props.visit?.type}
        </DialogTitle>
        <DialogContent>
          <Box sx={{".MuiTabs-flexContainer": {justifyContent: "center"}}}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Visit" id="visit" />
                <Tab label="Client" id="client" />
                {props.visit.job && <Tab label="Job" id="job" />}
            </Tabs>
            {value === 0 &&
                <Stack spacing={1.5} mt={2} ml={4}>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography id="type-label" sx={{ color: 'primary.main', height: "32px" }}>
                        Visit type
                      </Typography>
                    </Grid>
                    <Grid item xs={9} justifyContent="start">
                      <Chip sx={{backgroundColor: getEventColor(props.visit?.type), color: getBorderColor(props.visit?.type), fontSize: "16px"}} label={props.visit?.type} />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography id="property-label" sx={{ color: 'primary.main' }}>
                        Property
                      </Typography>
                    </Grid>
                    <Grid item xs={9} justifyContent="start">
                      <Box>{property?.address ?
                      <Stack direction={'row'}>
                        <Typography>{property?.address}</Typography>
                        <IconButton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${property?.address ?? ""}, ${property?.address2 ?? ""}, ${property?.city ?? ""}, ${property?.state ?? ""}`
                        )}`} target="_blank" sx={{paddingTop: 0}}><Directions color='primary'/></IconButton>
                      </Stack>
                      : <Typography>No property</Typography>}</Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography id="type-label" sx={{ color: 'primary.main', height: "32px" }}>
                        Assigned
                      </Typography>
                    </Grid>
                    <Grid item xs={9} justifyContent="start">
                      <Typography>{props.visit.users?.length > 0 ? props.visit.users?.map((u: any) => u.name ?? u.email)?.join(', ') : "No staff assigned"}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography id="type-label" sx={{ color: 'primary.main', height: "32px" }}>
                        Schedule
                      </Typography>
                    </Grid>
                    <Grid item xs={9} justifyContent="start">
                    {props.visit.unscheduled === (1 || true) ?
                            <Typography
                              >
                                Unscheduled
                              </Typography>
                          :
                          <>
                          {dayjs(props.visit.start).diff(dayjs(props.visit.displayEnd), 'hours') < 24 &&
                          dayjs(props.visit.start).diff(dayjs(props.visit.displayEnd), 'hours') > -24 ? (
                            // if start and end within 1 day of eachother
                            props.visit.anytime === (1 || true) ? (
                              // if anytime: Jan 13
                              <Typography
                              >
                                {dayjs(props.visit.start).format('MMM D')} - Anytime
                              </Typography>
                            ) : (
                              // if not anytime: Jan 13 4:30pm - 6:00pm
                              <Typography
                              >
                                {dayjs(props.visit.start).format('MMM D')}{' '}
                                {dayjs(props.visit.start).format('h:mma')} -{' '}
                                {dayjs(props.visit.displayEnd).format('h:mma')}
                              </Typography>
                            )
                          ) : (
                            // if start and end not within 1 day of eachother: Jan 13 - Jan 16
                            <Typography
                            >
                              {dayjs(props.visit.start).format('MMM D')} -{' '}
                              {dayjs(props.visit.displayEnd).format('MMM D')}
                            </Typography>
                          )}                    
                          </>
                          }
                    </Grid>
                  </Grid>
                  <InputLabel id="notes-label" sx={{ color: 'primary.main' }}>
                      Notes
                  </InputLabel>
                  <Typography>{props.visit.notes?.length > 0 ? props.visit.notes : "No notes"}</Typography>
                </Stack>
            }
            {value === 2 &&
                <Stack spacing={2} mt={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack spacing={2}>
                      <Typography
                        textAlign="center"
                        variant="body2"
                        fontWeight={500}
                        color="neutral.light"
                      >
                        Created
                      </Typography>
                      <Typography textAlign="center" variant="body2">
                        11/27/2022
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Typography
                        textAlign="center"
                        variant="body2"
                        fontWeight={500}
                        color="neutral.light"
                      >
                        From
                      </Typography>
                      {job.job.quote ? (
                        <Link
                          sx={{ textAlign: 'center' }}
                          href={`/quotes/${job.job.quote}`}
                        >
                          Quote
                        </Link>
                      ) : (
                        <Typography textAlign="center">-</Typography>
                      )}
                    </Stack>
                    <Stack spacing={2}>
                      <Typography
                        textAlign="center"
                        variant="body2"
                        fontWeight={500}
                        color="neutral.light"
                      >
                        Used for
                      </Typography>
                      {job.job.invoice ? (
                        <Link
                          sx={{ textAlign: 'center' }}
                          href={`/invoices/${job.job.invoice}`}
                        >
                          Invoice
                        </Link>
                      ) : (
                        <Typography textAlign="center">-</Typography>
                      )}
                    </Stack>
                    <Stack spacing={1}>
                      <Typography
                        textAlign="center"
                        variant="body2"
                        fontWeight={500}
                        color="neutral.light"
                      >
                        Status
                      </Typography>
                      <Chip label={job.job.status}  sx={{backgroundColor: `${getChipColor(job.job.status as string)}.main`, color: `${getChipColor(job.job.status as string)}.dark`}}  />
                    </Stack>
                  </Stack>
                  <Divider sx={{ mt: 3, mb: 1 }} />
                    {job.items.map((item: any, index: number) => (
                        <Box sx={{ px: 4 }} key={index}>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid item={true} xs={4}>
                            <Stack spacing={1.5}>
                                <Typography variant="body2" color="neutral.light" fontWeight={500}>
                                Service
                                </Typography>
                                <Typography variant="body2" color="neutral.main" fontWeight={600}>
                                {item.title}
                                </Typography>
                            </Stack>
                            </Grid>
                            <Grid item={true} xs={4}></Grid>
                            <Grid item={true} xs={4}>
                            <Stack spacing={1.5} alignItems="flex-end">
                                <Typography variant="body2" color="neutral.light" fontWeight={500}>
                                Total
                                </Typography>
                                <Typography variant="body2" color="neutral.main" fontWeight={600}>
                                ${item.price}
                                </Typography>
                            </Stack>
                            </Grid>
                        </Grid>
                        <Stack marginTop={3}>
                            <Typography variant="body2" color="neutral.light">
                            Description
                            </Typography>
                            <Divider />
                            <Typography
                            variant="body2"
                            color="neutral.main"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                            ></Typography>
                        </Stack>
                        <Divider />
                        </Box>
                    ))}
                    {job?.items?.length === 0 && <EmptyState type="job-items" />}
                  <Grid container justifyContent="flex-end" mt={2.5}>
                        <Grid item xs={4} sm={2}>
                          <Typography variant="h6" color="primary" fontWeight={700}>
                            Subtotal
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="h6" fontWeight={600} color="neutral.main">
                            ${job.items.map((i: any) => i.price).reduce(add, 0)}
                          </Typography>
                        </Grid>
                  </Grid>
              </Stack>
            }
            {value === 1 &&
            <>
              <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              marginY={3}
            >
              <Typography fontWeight={600} fontSize={18}>
                {client?.first} {client?.last}
              </Typography>
            </Stack>
            <Stack spacing={4} mx={4}>
              <Stack spacing={2}>
                {client?.contacts
                  ?.filter((c: any) => c.type === 'phone' && c.content !== '')
                  .map((phone: any, index: number) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <StyledTypography color="primary" variant="body2">
                        Phone
                      </StyledTypography>
                      <StyledTypography variant="body2">{phone.content}</StyledTypography>
                    </Stack>
                  ))}
                {client?.contacts?.filter(
                  (c: any) => c.type === 'phone' && c.content !== ''
                ).length === 0 && (
                  <Stack direction="row" spacing={2}>
                    <StyledTypography color="primary" variant="body2">
                      Phone
                    </StyledTypography>
                    <StyledTypography variant="body2">No phone numbers</StyledTypography>
                  </Stack>
                )}
              </Stack>
              <Stack spacing={2}>
                {client?.contacts
                  ?.filter((c: any) => c.type === 'email' && c.content !== '')
                  .map((email: any, index: number) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <StyledTypography color="primary" variant="body2">
                        Email
                      </StyledTypography>
                      <StyledTypography variant="body2">{email.content}</StyledTypography>
                    </Stack>
                  ))}
                {client?.contacts?.filter(
                  (c: any) => c.type === 'email' && c.content !== ''
                ).length === 0 && (
                  <Stack direction="row" spacing={2}>
                    <StyledTypography color="primary" variant="body2">
                      Email
                    </StyledTypography>
                    <StyledTypography variant="body2">No email addresses</StyledTypography>
                  </Stack>
                )}
                </Stack>
                <StyledTypography color="primary" variant="body2">
                  Properties
                </StyledTypography>
                <Box sx={{'& .MuiDataGrid-cell': {outline: 'none !important'}}}>
                  <DataGrid
                    error={error}
                    autoHeight
                    rows={properties}
                    columns={propertyColumns}
                    hideFooter
                    rowHeight={70}
                    disableColumnMenu
                  />
                </Box>
            </Stack>
            </>
            }
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          {value === 0 &&
            <Button variant="contained" onClick={handleEditVisit}>
              Edit Visit
            </Button>
          }
          {value === 1 &&
            <Button variant="contained" href={`/clients/${client.id}`}>
              Go to client
            </Button>
          }
          {value === 2 &&
            <Button variant="contained" href={`/jobs/${job.job.id}`}>
              Go to job
            </Button>
          }
          
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
        <EditVisit
        visit={props.visit}
        setVisit={props.setVisit}
        open={editVisitOpen}
        onClose={handleCloseEditVisit}
        update={handleUpdate}
        type={'edit'}
        users={users}
        client={props.visit.client}
        startTime={startTime}
        endTime={endTime}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        success={props.success}
        reload={props.reload}
        setReload={props.setReload}
      />
      </Dialog>
    );
  }
  