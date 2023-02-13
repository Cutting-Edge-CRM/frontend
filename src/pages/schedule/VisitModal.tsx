import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputLabel,
    Link,
    Stack,
    styled,
    Tab,
    Tabs,
    Typography,
    TypographyProps,
  } from '@mui/material';
  import * as React from 'react';
  import { useEffect, useState } from 'react';
import { getClient } from '../../api/client.api';
import { getJob } from '../../api/job.api';
  import { listProperties } from '../../api/property.api';
import EmptyState from '../../shared/EmptyState';
import { getChipColor } from '../../theme/theme';

  function add(accumulator: number, a: number) {
      return +accumulator + +a;
    }
    
  const StyledTypography = styled(Typography)<TypographyProps>(() => ({
    minWidth: 74,
    fontWeight: 400,
    fontSize: 16
  }));
  
  export default function EditVisit(props: any) {
    const [error, setError] = useState(null);
    const [properties, setProperties] = useState([] as any[]);
    const [value, setValue] = useState(0);
    const [client, setClient] = useState({} as any);
    const [job, setJob] = useState({} as any);
    
    const handleCancel = () => {
      props.onClose();
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
  
    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle align="center">
          View {props.visit?.type}
        </DialogTitle>
        <DialogContent>
          <Box width={'500px'}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Visit" id="visit" />
                <Tab label="Client" id="client" />
                {props.visit.job && <Tab label="Job" id="job" />}
            </Tabs>
            {value === 0 &&
                <Stack spacing={1.5} mt={2}>
                <InputLabel id="type-label" sx={{ color: 'primary.main' }}>
                    Visit type
                </InputLabel>
                <Typography>{props.visit?.type}</Typography>
                <InputLabel id="property-label" sx={{ color: 'primary.main' }}>
                    Property
                </InputLabel>
                <Typography>{properties.find((p) => p.id === props.visit.property)?.address}</Typography>
                <InputLabel id="assigned-label" sx={{ color: 'primary.main' }}>
                    Assigned
                </InputLabel>
                <Typography>{props.visit.users?.map((u: any) => u.name ?? u.email)?.join(', ') ?? "No staff assigned"}</Typography>
                <InputLabel id="notes-label" sx={{ color: 'primary.main' }}>
                    Notes
                </InputLabel>
                <Typography>{props.visit.notes?.length > 0 ? props.visit.notes : "No notes"}</Typography>
                <InputLabel id="schedule-label" sx={{ color: 'primary.main' }}>
                    Schedule
                </InputLabel>
                {+props.visit.unscheduled === (1 || true)
                ?
                <Typography>Unscheduled</Typography>
                :
                <>
                <Stack direction="row" justifyContent="space-between" width="100%">
                    <Typography>{props.visit.start}</Typography>
                    <Typography>{props.visit.end}</Typography>
                </Stack>
                <>
                {+props.visit.anytime === (1 || true)
                ?
                <Typography>Anytime</Typography>
                :
                <Stack direction="row" spacing={1}>
                    <Typography>{props.startTime}</Typography>
                    <Typography>{props.endTime}</Typography>
                </Stack>
                }
                </>
                </>
                }
                <Stack direction="row"></Stack>
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
                        <Grid item xs={3}>
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
              justifyContent="space-between"
              marginBottom={3}
            >
              <Typography fontWeight={600} fontSize={18}>
                {client?.first} {client?.last}
              </Typography>
            </Stack>
            <Stack spacing={4}>
              <Stack spacing={2}>
                {client?.contacts
                  ?.filter((c: any) => c.type === 'phone' && c.content !== '')
                  .map((phone: any, index: number) => (
                    <Stack direction="row" spacing={2} key={index} justifyContent="space-evenly">
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
                <Stack spacing={2}>
                {properties?.map((property: any, index: number) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <StyledTypography color="primary" variant="body2">
                        Property
                      </StyledTypography>
                      <Stack>
                        <StyledTypography variant="body2">{property.address}</StyledTypography>
                        <StyledTypography variant="body2">{property.city ? (property.state ? `${property.city}, ${property.state}` : property.city) : (property.state ?? '')}</StyledTypography>
                      </Stack>
                    </Stack>
                  ))}
                {properties?.length === 0 && (
                  <Stack direction="row" spacing={2}>
                    <StyledTypography color="primary" variant="body2">
                      Property
                    </StyledTypography>
                    <StyledTypography variant="body2">No properties</StyledTypography>
                  </Stack>
                )}
              </Stack>
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
            <Button variant="contained">
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
      </Dialog>
    );
  }
  