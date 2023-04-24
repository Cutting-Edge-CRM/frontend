import {
  ArchiveOutlined,
  AttachMoney,
  Check,
  ContentCopyOutlined,
  DeleteOutline,
  FileDownloadOutlined,
  FormatPaintOutlined,
  MarkEmailReadOutlined,
  MoreVert,
  PreviewOutlined,
  SendOutlined,
  ThumbDownAltOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createJob, updateJob } from '../../api/job.api';
import { listProposalResources, listQuoteResources, updateQuoteResources } from '../../api/proposals.api';
import { downloadQuote, updateQuote } from '../../api/quote.api';
import { createTimeline } from '../../api/timeline.api';
import { isAllowed } from '../../auth/FeatureGuards';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Duplicate from '../../shared/Duplicate';
import PaymentModal from '../../shared/PaymentModal';
import SendQuoteModal from '../../shared/SendQuoteModal';
import { getChipColor, theme } from '../../theme/theme';
import ProposalDetails from './ProposalDetails';
import QuoteDetails from './QuoteDetails';

function add(accumulator: any, a: any) {
  return +accumulator + +a;
}

function QuoteCard(props: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  // const [value, setValue] = useState(0);
  const [editting, setEditting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [payment, setPayment] = useState({} as any);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [type, setType] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [about, setAbout] = useState('');
  const [proposal, setProposal] = useState({} as any);
  const [selected, setSelected] = useState([] as any);

  const handleChangeTabValue = (e: any, newValue: number) => {
    setTabValue(newValue);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const edit = queryParams.get('edit') === 'true';
    setEditting(edit);

}, [location.search])

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleEditting = () => {
    if (editting) {
      handleSave();
    } else {
      window.history.replaceState(null, '', `?edit=true`);
      setEditting(true);
    }
  };

  const handleSave = () => {
    setLoading(true);
    updateQuote(props.quote).then(
      (res) => {
        // update proposal
        updateQuoteResources(props.quote.quote.id, about, selected).then(selectedRes => {
          setLoading(false);
          window.history.replaceState(null, '', window.location.pathname);
          props.success('Successfully updated quote');
          setEditting(false);
        })
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  }

  const handleCancel = () => {
    setEditting(false);
    window.history.replaceState(null, '', window.location.pathname);
    props.setReload(!props.reload);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
    closeMenu();
  };

  const onDelete = () => {
    navigate(`/quotes`);
  };

  const handleDuplicateQuote = () => {
    setDuplicateOpen(true);
  };

  const handleSend = () => {
    setSendOpen(true);
  };

  const handleDuplicateClose = (value: string) => {
    setDuplicateOpen(false);
    setAnchorEl(null);
  };

  const handleSendClose = (value: string) => {
    setSendOpen(false);
    setAnchorEl(null);
  };

  const handlePaymentClose = () => {
    setPaymentOpen(false);
    setAnchorEl(null);
  };

  const handleNewDeposit = () => {
    setType('new');
    setPayment({
      client: props.quote.quote.client,
      type: 'deposit',
      typeId: props.quote.quote.id,
      details: `Deposit for quote #${props.quote.quote.id}`,
      transDate: dayjs(),
      method: 'Cheque',
      amount: (+(props.quote.options?.[0]?.depositPercent
      ? (+props.quote.options?.[0]?.deposit / 100) *
          (props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
            +props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
              props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
      : props.quote.options?.[0]?.deposit))?.toFixed(2)
    });
    setPaymentOpen(true);
  };

  const handleEditDeposit = (event: any, currPayment: any) => {
    if (currPayment.method === 'Credit Card') {
      return;
    }
    setType('edit');
    setPayment(currPayment);
    setPaymentOpen(true);
  };

  const handlePreview = () => {
    window.open(`${process.env.REACT_APP_URL}/client-hub/${props.quote.quote.client}/quotes/${props.quote.quote.id}`)
  }

  const handleDownload = () => {
    setLoading(true);
    downloadQuote(props.quote.quote.id)
    .then(res => {
      const url = window.URL.createObjectURL(res as Blob);
      window.open(url);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    })
  }

  const markQuoteAs = (status: string) => {
    closeMenu();
    props.quote.quote.status = status;
    updateQuote(props.quote).then(
      (res) => {
        let timeline_event = {
          client: props.quote.quote.client,
          resourceId: props.quote.quote.id,
          resourceType: 'quote',
          resourceAction: status.toLowerCase()
        };
        createTimeline(timeline_event);
        props.success('Status updated successfully');
      },
      (err) => {}
    );
  };

  const handleConvertToJob = () => {
    let job: any = {
      client: props.quote.quote.client,
      property: props.quote.quote.property,
      status: 'Active',
      quote: props.quote.quote.id,
      tax: props.quote?.options?.[0]?.tax
    };
    createJob(job).then(
      (res) => {
        let updatingJob: any = {};
        updatingJob.job = job;
        updatingJob.job.id = res.id;
        let items: any[] = [];
        props.quote.options.forEach((op: any) => {
          items = items.concat(
            op.items.filter(
              (it: any) =>
                it.addon !== 1 || (it.addon === 1 && it.selected === 1)
            )
          );
        });
        updatingJob.items = items;
        updateJob(updatingJob).then(
          (_) => {
            let timeline_event = {
              client: props.quote.quote.client,
              resourceId: props.quote.quote.id,
              resourceType: 'quote',
              resourceAction: 'converted'
            };
            createTimeline(timeline_event);
            props.quote.quote.status = 'Converted';
            props.quote.quote.job = res.id;
            updateQuote(props.quote).then(
              (res) => {},
              (err) => {}
            );
            navigate(`/jobs/${res.id}`);
            props.success('Successfully converted quote to job');
          },
          (err) => {}
        );
      },
      (err: any) => {}
    );
  };

  const checkValid = () => {
    let valid = true;
    props.quote.options?.[0]?.items.forEach((it: any) => {
      if (+it.quantity < 1) valid = false;
    })
    return valid;
  }

  const handleChangeAbout = (e: any) => {
    setAbout(e.target.value);
}

const handleSelect = (e: any, id: any, type: string) => {
    if (e.target.checked) {
        setSelected(selected.concat({resourceId: id, resourceType: type}));
    } else {
        let index = selected.findIndex((s: any) => s.resourceId === id);
        let newSelected = selected.slice(undefined, index).concat(selected.slice(index + 1, undefined));
        setSelected(newSelected);
    }
}



useEffect(() => {
    setAbout(props.quote.quote.about ?? props.settings.about);
    listProposalResources().then(res => {
        setProposal(res);
    });
    listQuoteResources(props.quote.quote.id).then(res => {
        setSelected(res);
    })
}, [props.settings.about, props.quote.quote.about, props.quote.quote.id])

  function getActionButtons(props: any) {

    if (mobile) {
      return (
        <Chip label={props.quote.quote.status}  sx={{backgroundColor: `${getChipColor(props.quote.quote.status as string)}.main`, color: `${getChipColor(props.quote.quote.status as string)}.dark`}}  />
      )
    }

    if (props.quote.quote.status === 'Draft') {
      return (
        <>
        <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        >
          Send
        </Button>
        <Button
        variant="contained"
        onClick={() => markQuoteAs('Pending')}
        >
          Mark as Pending
        </Button>
        </>
      )
    }
    if (props.quote.quote.status === 'Pending') {
      return (
        <Button
        variant="contained"
        onClick={() => markQuoteAs('Approved')}
        >
          Approve
        </Button>
      )
    }
    
    if (props.quote.quote.status === 'Approved' && (props.payments.map((p: any) => p.amount).reduce(add, 0) < 
    (props.quote.options?.[0]?.depositPercent
      ? (+props.quote.options?.[0]?.deposit / 100) *
          (props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
            +props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
              props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
      : props.quote.options?.[0]?.deposit))
    ) {
      return (
        <>
        <Button
        variant="contained"
        color="primary"
        onClick={handleNewDeposit}
        >
          Collect deposit
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleConvertToJob}
        >
          Convert to Job
        </Button>
        </>
      )
    }
    if (props.quote.quote.status === 'Approved') {
      return (
        <Button
        variant="contained"
        color="primary"
        onClick={handleConvertToJob}
        >
          Convert to Job
        </Button>
      )
    }
    if (props.quote.quote.status === 'Rejected') {
      return (<></>);
    }
    if (props.quote.quote.status === 'Converted') {
      return (<></>);
    }
  
  }


  return (
    <Stack spacing={2}>
      <Card sx={{ pb: 4, pt: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Typography variant="h6" fontWeight={600}>
            {`Quote #${props.quote.quote.id}`}
          </Typography>
          {isAllowed('edit-quote') &&
          <Stack direction={'row'} spacing={2}>
          {getActionButtons(props)}
          <IconButton onClick={openMenu} color="primary">
            <MoreVert />
          </IconButton>
          <Menu
            id="visit-menu"
            anchorEl={anchorEl}
            open={isOpen}
            onClose={closeMenu}
          >
            <MenuList>
              {props.quote.quote.status !== 'Converted' && props.quote.quote.status !=='Pending' && (
                <MenuItem onClick={() => markQuoteAs('Pending')}>
                  <ListItemIcon>
                    <MarkEmailReadOutlined />
                  </ListItemIcon>
                  <ListItemText>Mark as Pending</ListItemText>
                </MenuItem>
              )}
              {props.quote.quote.status !== 'Converted' && props.quote.quote.status !=='Approved'  && (
                <MenuItem onClick={() => markQuoteAs('Approved')}>
                  <ListItemIcon>
                    <Check />
                  </ListItemIcon>
                  <ListItemText>Mark as Approved</ListItemText>
                </MenuItem>
              )}
              {props.quote.quote.status !== 'Converted' && props.quote.quote.status !=='Rejected'  && (
                <MenuItem onClick={() => markQuoteAs('Rejected')}>
                  <ListItemIcon>
                    <ThumbDownAltOutlined />
                  </ListItemIcon>
                  <ListItemText>Mark as Rejected</ListItemText>
                </MenuItem>
              )}
              {props.quote.quote.status === 'Approved' && (
              <MenuItem onClick={handleNewDeposit}>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText>Collect Deposit</ListItemText>
              </MenuItem>
              )}
              {(props.quote.quote.status === 'Approved' || props.quote.quote.status === 'Converted') && (
                <MenuItem onClick={handleConvertToJob}>
                  <ListItemIcon>
                    <FormatPaintOutlined />
                  </ListItemIcon>
                  <ListItemText>Convert to Job</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={handleDuplicateQuote}>
                <ListItemIcon>
                  <ContentCopyOutlined />
                </ListItemIcon>
                <ListItemText>Duplicate</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSend}>
                <ListItemIcon>
                  <SendOutlined />
                </ListItemIcon>
                <ListItemText>Send</ListItemText>
              </MenuItem>
              <MenuItem onClick={handlePreview}>
                <ListItemIcon>
                  <PreviewOutlined />
                </ListItemIcon>
                <ListItemText>Preview as Client</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDownload}>
                <ListItemIcon>
                  <FileDownloadOutlined />
                </ListItemIcon>
                <ListItemText>Download PDF</ListItemText>
              </MenuItem>
              {props.quote.quote.status !== ('Converted' || 'Archived') && (
                <MenuItem onClick={() => markQuoteAs('Archived')}>
                  <ListItemIcon>
                    <ArchiveOutlined />
                  </ListItemIcon>
                  <ListItemText>Archive</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={handleDeleteOpen}>
                <ListItemIcon>
                  <DeleteOutline color="error" />
                </ListItemIcon>
                <ListItemText>Delete quote</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
          </Stack>
          }
        </Stack>
        
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
              {dayjs(props.quote.quote.created).format("MM/DD/YYYY")}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Opened by client
            </Typography>
            <Typography textAlign="center" variant="body2">
              {props.opened ? dayjs(props.opened).format("MM/DD/YYYY"): '-'}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Used For
            </Typography>
            {props.quote.quote.job ? (
              <Link
                color="primary"
                sx={{ textAlign: 'center' }}
                href={`/jobs/${props.quote.quote.job}`}
              >
                Job
              </Link>
            ) : (
              <Typography textAlign="center" variant="body2">
                -
              </Typography>
            )}
          </Stack>
          {!mobile &&
            <Stack spacing={1}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Status
            </Typography>
            <Chip label={props.quote.quote.status}  sx={{backgroundColor: `${getChipColor(props.quote.quote.status as string)}.main`, color: `${getChipColor(props.quote.quote.status as string)}.dark`}}  />
          </Stack>
          }
        </Stack>
      </Card>
      <Card sx={{ py: 3 }}>
        <Stack direction={'row'}>
        <Tabs value={tabValue} onChange={handleChangeTabValue} aria-label="basic tabs example">
          <Tab label="Price Details" />
          <Tab label="Proposal Options" />
        </Tabs>
        <Box marginLeft={'auto'}>
            {isAllowed('edit-quote') &&
            <>
            {editting ? (
              <Stack direction="row" spacing={2}>
                <Button onClick={handleCancel} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleEditting}
                  variant="contained"
                  color="primary"
                  disabled={!(checkValid())}
                >
                  Save Changes
                </Button>
              </Stack>
            ) : (
              <Button
                onClick={handleEditting}
                variant="contained"
                color="primary"
              >
                Edit Quote
              </Button>
            )}
            </>
            }
          </Box>
          </Stack>
        {loading && <LinearProgress />}
        {tabValue === 0 &&
        <>
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            {props.quote.options?.map((_: any, index: number) => (
              <Tab
                key={index}
                label={`Option ${index + 1}`}
                id={`${index + 1}`}
              />
            ))}
            {editting && <Tab label={`Add Option`} value="add" />}
          </Tabs>
        </Box> */}
        {/* {props.quote.options?.map((option: any, index: number) => ( */}
          <QuoteDetails
            option={props.quote.options?.[0]}
            // key={index}
            // value={value}
            // index={index}
            editting={editting}
            {...props}
          />
        {/* ))} */}
        {isAllowed('view-pricing') && props.payments.length > 0 && (
          <>
              <Stack mt={3.5} spacing={1}>
                <Grid container justifyContent={'end'}>
                  <Grid item xs={8} sm={6} >
                  <Typography variant="h6" color="primary" fontWeight={500}>Payments</Typography>
                  </Grid>
                </Grid>
                <List>
                  {props.payments.map((payment: any) => (
                    <Tooltip key={payment.id} title={payment.method === 'Credit Card' ? "Cannot edit credit card payments": ''}>
                    <ListItemButton
                      id={payment.id}
                      onClick={(e) => handleEditDeposit(e, payment)}
                    >
                        <Grid container justifyContent="flex-end">
                        <Grid item xs={8} sm={6}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={8}>
                              <Typography
                                variant="body2"
                                color="neutral.light"
                                fontWeight={500}
                              >
                                Deposit{' '}{dayjs(payment.transDate).format('MMM D')}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              {props.editting ? (
                                <Stack direction="row" spacing={1}>
                                  <TextField
                                    id="deposit"
                                    label="Deposit"
                                    value={props.option.deposit}
                                    size="small"
                                  />
                                  <Select
                                    labelId="deposit-percent-select-label"
                                    id="depositPercent"
                                    value={props.option.depositPercent ? 1 : 0}
                                    label="$/%"
                                    size="small"
                                  >
                                    <MenuItem value={1}>%</MenuItem>
                                    <MenuItem value={0}>$</MenuItem>
                                  </Select>
                                </Stack>
                              ) : (
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="neutral.main"
                                >
                                  ${(+payment?.amount)?.toFixed(2)}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ListItemButton>
                    </Tooltip>
                  ))}
                </List>
              </Stack>
          </>
        )}
        </>
        }
        {tabValue === 1 &&
          <ProposalDetails
          quote={props.quote}
          settings={props.settings}
          about={about}
          handleChangeAbout={handleChangeAbout}
          proposal={proposal}
          selected={selected}
          handleSelect={handleSelect}
          editting={editting}
          />
        }
        
        {error && <Alert severity="error">{error}</Alert>}
        <ConfirmDelete
          open={deleteOpen}
          onClose={handleDeleteClose}
          type={'quotes'}
          deleteId={props.quote.quote.id}
          onDelete={onDelete}
          success={props.success}
        />
        <Duplicate
          open={duplicateOpen}
          onClose={handleDuplicateClose}
          type={'Quote'}
          quote={props.quote}
          success={props.success}
        />
        <SendQuoteModal
          open={sendOpen}
          onClose={handleSendClose}
          type={'Quote'}
          quote={props.quote}
          success={props.success}
          settings={props.settings}
        />
        <PaymentModal
          payment={payment}
          setPayment={setPayment}
          open={paymentOpen}
          onClose={handlePaymentClose}
          paymentType={'Deposit'}
          type={type}
          success={props.success}
          quote={props.quote}
          reload={props.reload}
          setReload={props.setReload}
          settings={props.settings}
        />
      </Card>
    </Stack>
  );
}

export default QuoteCard;
