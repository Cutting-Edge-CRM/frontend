import {
  AddCircleOutlineOutlined,
  ArchiveOutlined,
  AttachMoney,
  Check,
  ContentCopyOutlined,
  DeleteOutline,
  FileDownloadOutlined,
  FormatPaintOutlined,
  MarkEmailReadOutlined,
  MoreVert,
  SendOutlined,
  ThumbDownAltOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
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
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, updateJob } from '../../api/job.api';
import { updateQuote } from '../../api/quote.api';
import { createTimeline } from '../../api/timeline.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Duplicate from '../../shared/Duplicate';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from '../../shared/PaymentModal';
import RichText from '../../shared/richtext/RichText';
import SendQuoteModal from '../../shared/SendQuoteModal';

function add(accumulator: any, a: any) {
  return +accumulator + +a;
}

function QuoteItemSaved(props: any) {
  return (
    <>
      <Grid container spacing={2} marginTop={2}>
        <Grid item={true} xs={4}>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Service
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              {props.item.title}
            </Typography>
          </Stack>
        </Grid>
        <Grid item={true} xs={4}>
          {props.upsell && (
            <Stack alignItems="center">
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.light"
                fontWeight={500}
              >
                Selected
              </Typography>
              <Switch disabled checked={props.item.selected === 1}></Switch>
            </Stack>
          )}
        </Grid>
        <Grid item={true} xs={4}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography
              variant="body2"
              textAlign="center"
              color="neutral.light"
              fontWeight={500}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              color="neutral.main"
              fontWeight={600}
            >
              ${(+props.item.price).toFixed(2)}
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
          dangerouslySetInnerHTML={{ __html: props.item.description }}
        ></Typography>
      </Stack>
    </>
  );
}

function QuoteItemEdit(props: any) {
  const handleChange = (event: any) => {
    let options = props.quote.options;
    options
      .find((op: any) => op === props.option)
      .items.find((it: any) => it === props.item)[event.target.id] =
      event.target.value;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  const handleCheck = (event: any) => {
    let options = props.quote.options;
    options
      .find((op: any) => op === props.option)
      .items.find((it: any) => it === props.item)[event.target.id] = event
      .target.checked
      ? 1
      : 0;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  const handleDeleteItem = () => {
    let options = props.quote.options;
    let option = options.find((op: any) => op === props.option);
    let item = option.items.find((it: any) => it === props.item);
    let itemIndex = option.items.indexOf(item);
    options.find((op: any) => op === props.option).items = option.items
      .slice(undefined, itemIndex)
      .concat(option.items.slice(itemIndex + 1, undefined));
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  return (
    <Card sx={{backgroundColor: '#F3F5F8', my: 3, py: 3, boxShadow: 'none'}}>
      <Grid container spacing={2}>
        <Grid item={true} xs={4}>
          <InputLabel id="service-label" sx={{ color: 'primary.main' }}>
              Service
          </InputLabel>
          <TextField
            id="title"
            error={!props.item.title?.trim()?.length}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormatPaintOutlined color='primary' />
                </InputAdornment>
              ),
            }}
            value={props.item.title ? props.item.title : ''}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item={true} xs={4}>
          {props.upsell && (
            <Stack alignItems="center">
              <InputLabel id="selected-label" sx={{ color: 'primary.main' }}>
                Selected
              </InputLabel>
              <Switch
                id="selected"
                checked={props.item.selected === 1}
                onChange={handleCheck}
              ></Switch>
            </Stack>
          )}
        </Grid>
        <Grid item={true} xs={4}>
          <Stack>
            <InputLabel id="price-label" sx={{ color: 'primary.main' }}>
                Price
            </InputLabel>
            <TextField
              id="price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color='primary' />
                  </InputAdornment>
                ),
              }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={props.item.price ? props.item.price : ''}
              onChange={handleChange}
              size="small"
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack spacing={1.5} mt={2}>
        <InputLabel id="description-label" sx={{ color: 'primary.main' }}>
          Description
        </InputLabel>
        <RichText
          id="description"
          value={props.item.description ? props.item.description : ''}
          onChange={handleChange}
        />
        {props.option.items.length > 1 && 
          <Button
          onClick={handleDeleteItem}
          startIcon={<DeleteOutline />}
          color="error"
          sx={{ alignSelf: 'flex-end' }}
        >
          Delete Item
        </Button>
        }
      </Stack>
    </Card>
  );
}

function TabPanel(props: any) {
  const [depositAmount, setDepositAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [subTotalAmount, setSubtotalAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleChangeDeposit = (event: any) => {
    let options = props.quote.options;
    options.find((op: any) => op === props.option)[event.target.id] =
      event.target.value;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  const handleChangePercent = (event: any) => {
    let options = props.quote.options;
    options.find((op: any) => op === props.option).depositPercent =
      event.target.value;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  const handleChangeTax = (event: any) => {
    let options = props.quote.options;
    options.find((op: any) => op === props.option).tax = event.target.value.id;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  useEffect(() => {
    setSubtotalAmount(
      props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
    );
    setTaxAmount(
      +props.taxes.find((t: any) => t.id === props.option.tax)?.tax *
        props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
    );
    setTotalAmount(
      props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
        +props.taxes.find((t: any) => t.id === props.option.tax)?.tax *
          props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
    );
    setDepositAmount(
      props.option.depositPercent
        ? (+props.option.deposit / 100) *
            (props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
              +props.taxes.find((t: any) => t.id === props.option.tax)?.tax *
                props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
        : props.option.deposit
    );
  }, [props]);

  const handleAddItem = () => {
    let options = props.quote.options;
    let items = props.option.items;
    items.push({ price: 0 });
    options.find((op: any) => op === props.option).items = items;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  const handleAddUpsell = () => {
    let options = props.quote.options;
    let items = props.option.items;
    items.push({ price: 0, addon: 1 });
    options.find((op: any) => op === props.option).items = items;
    props.setQuote({
      quote: props.quote.quote,
      options: options,
    });
  };

  return (
    <Box
      role="tabpanel"
      hidden={props.value !== props.index}
      id={`option-${props.index}`}
      paddingX={4}
      marginTop={3}
    >
      {props.value === props.index && (
        <>
          {props.editting && (
            <>
              {props.option.items.map((item: any, index: number) => (
                <QuoteItemEdit
                  key={index}
                  item={item}
                  upsell={item.addon === 1}
                  {...props}
                />
              ))}
              <Stack
                direction={'row'}
                justifyContent="center"
                spacing={4}
                mb={2}
              >
                <Button
                  onClick={handleAddItem}
                  startIcon={<AddCircleOutlineOutlined />}
                >
                  <Typography>Add Item</Typography>
                </Button>
                <Button
                  onClick={handleAddUpsell}
                  startIcon={<AddCircleOutlineOutlined />}
                >
                  <Typography>Add Upsell</Typography>
                </Button>
              </Stack>
            </>
          )}
          {!props.editting && (
            <>
              {props.option.items.map((item: any, index: number) => (
                <QuoteItemSaved
                  key={index}
                  item={item}
                  upsell={item.addon === 1}
                  {...props}
                />
              ))}
              {props.job?.items?.length === 0 && (
                <EmptyState type="quote-items" />
              )}
            </>
          )}
          <Stack mt={2.5} spacing={2}>
            <Grid container justifyContent="flex-end">
              <Grid item xs={4}>
                <Grid container>
                  <Grid item xs={5}>
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={600}
                    >
                      Subtotal
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="neutral.main"
                    >
                      ${subTotalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={4}>
                <Grid container alignItems="center">
                  <Grid item xs={5}>
                    <Typography
                      variant="body2"
                      color="neutral.light"
                      fontWeight={500}
                    >
                      Deposit
                    </Typography>
                  </Grid>

                  <Grid item xs={props.editting ? 7 : 4}>
                    {props.editting ? (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          id="deposit"
                          label="Deposit"
                          value={props.option.deposit}
                          onChange={handleChangeDeposit}
                          size="small"
                        />
                        <Select
                          labelId="deposit-percent-select-label"
                          id="depositPercent"
                          value={props.option.depositPercent ? 1 : 0}
                          label="$/%"
                          onChange={handleChangePercent}
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
                        ${depositAmount.toFixed(2)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={4}>
                <Grid container alignItems="center">
                  <Grid item xs={5}>
                    <Typography
                      variant="body2"
                      color="neutral.light"
                      fontWeight={500}
                    >
                      Taxes
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {props.editting ? (
                      <Select
                        labelId="tax-label"
                        id="tax"
                        value={props.taxes.find(
                          (t: any) => t.id === props.option.tax
                        )}
                        onChange={handleChangeTax}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.title}
                          </Box>
                        )}
                        size="small"
                      >
                        {props.taxes.map((tax: any) => (
                          <MenuItem key={tax.id} value={tax}>
                            <Checkbox checked={tax.id === props.option.tax} />
                            <ListItemText primary={tax.title} />
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="neutral.main"
                      >
                        {taxAmount.toFixed(2)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={5}>
                <Divider sx={{ width: '100%' }} />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={4}>
                <Grid container>
                  <Grid item xs={5}>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="neutral.main"
                    >
                      ${totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </>
      )}
    </Box>
  );
}

function QuoteDetails(props: any) {
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

  // const handleChange = (event: React.SyntheticEvent, newValue: any) => {
  //   if (newValue === 'add') {
  //     let options = props.quote.options ? props.quote.options : [];
  //     options.push({
  //       deposit: 0,
  //       depositPercent: 0,
  //       tax: null,
  //       items: [{ price: 0 }],
  //     });
  //     setValue(options.length - 1);
  //   } else {
  //     setValue(newValue);
  //   }
  // };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleEditting = () => {
    if (editting) {
      setLoading(true);
      updateQuote(props.quote).then(
        (res) => {
          setLoading(false);
          props.success('Successfully updated quote');
        },
        (err) => {
          setLoading(false);
          setError(err.message);
        }
      );
    }
    setEditting(!editting);
  };

  const handleCancel = () => {
    setEditting(false);
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
      amount: (props.quote.options?.[0]?.depositPercent
      ? (+props.quote.options?.[0]?.deposit / 100) *
          (props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
            +props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.tax *
              props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
      : props.quote.options?.[0]?.deposit).toFixed(2)
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

  function getActionButtons(props: any) {

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
        color="primary"
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
        color="primary"
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
            +props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.tax *
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
              {props.quote.quote.status === 'Approved' && (
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
              <MenuItem>
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
                  <DeleteOutline />
                </ListItemIcon>
                <ListItemText>Delete quote</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
          </Stack>
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
          <Stack spacing={1}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Status
            </Typography>
            <Chip label={props.quote.quote.status} color="warning" />
          </Stack>
        </Stack>
      </Card>
      <Card sx={{ py: 3 }}>
        {loading && <LinearProgress />}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={600}>
            Quote Details
          </Typography>
          {editting ? (
            <Stack direction="row" spacing={2}>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleEditting}
                variant="contained"
                color="primary"
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
        </Stack>
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
          <TabPanel
            option={props.quote.options?.[0]}
            // key={index}
            // value={value}
            // index={index}
            editting={editting}
            {...props}
          />
        {/* ))} */}
        {props.payments.length > 0 && (
          <>
              <Stack mt={2.5} spacing={2}>
                <List>
                  {props.payments.map((payment: any) => (
                    <Tooltip key={payment.id} title={payment.method === 'Credit Card' ? "Cannot edit credit card payments": ''}>
                    <ListItemButton
                      id={payment.id}
                      onClick={(e) => handleEditDeposit(e, payment)}
                    >
                        <Grid container justifyContent="flex-end">
                        <Grid item xs={4}>
                          <Grid container alignItems="center">
                            <Grid item xs={8}>
                              <Typography
                                variant="body2"
                                color="neutral.light"
                                fontWeight={500}
                              >
                                Deposit collected{' '}{dayjs(payment.transDate).format('MMM D')}
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
        />
      </Card>
    </Stack>
  );
}

export default QuoteDetails;
