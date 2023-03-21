import {
  AddCircleOutlineOutlined,
  AttachMoney,
  DeleteOutline,
  Edit,
  FileDownloadOutlined,
  FormatPaintOutlined,
  MarkEmailReadOutlined,
  MoneyOffOutlined,
  MoreVert,
  Numbers,
  PreviewOutlined,
  SendOutlined,
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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadInvoice, updateInvoice } from '../../api/invoice.api';
import { createTimeline } from '../../api/timeline.api';
import { currentUserClaims } from '../../auth/firebase';
import ConfirmDelete from '../../shared/ConfirmDelete';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from '../../shared/PaymentModal';
import RichText from '../../shared/richtext/RichText';
import SendInvoiceModal from '../../shared/SendInvoiceModal';
import { getChipColor, theme } from '../../theme/theme';
import TaxModal from '../../shared/TaxModal';
import BillingAddress from './BillingAddress';


function add(accumulator: number, a: number) {
  return +accumulator + +a;
}

function InvoiceItemSaved(props: any) {
  return (
    <Box sx={{ px: useMediaQuery(theme.breakpoints.down("sm")) ? 0 : 4 }}>
      <Grid container spacing={2} marginTop={2} columns={10}>
        <Grid item={true} xs={2}>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Title
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              {props.item.title}
            </Typography>
          </Stack>
        </Grid>
        <Grid item={true} xs={2}></Grid>
        <Grid item={true} xs={2}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Unit $
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
            ${(+props.item.unit)?.toFixed(2)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item={true} xs={2}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Qty
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
            {(+props.item.quantity)?.toFixed(2)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item={true} xs={2}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Price
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              ${(+props.item.price)?.toFixed(2)}
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
    </Box>
  );
}

function InvoiceItemEdit(props: any) {
  const handleChange = (event: any) => {
    let items = props.invoice.items;
    items.find((it: any) => it === props.item)[event.target.id] =
      event.target.value;

    if (event.target.id === 'quantity') {
      items.find((it: any) => it === props.item)['price'] =
      event.target.value * items.find((it: any) => it === props.item)['unit']
    }
    if (event.target.id === 'unit') {
      items.find((it: any) => it === props.item)['price'] =
      event.target.value * items.find((it: any) => it === props.item)['quantity']
    }
    if (event.target.id === 'price') {
      items.find((it: any) => it === props.item)['unit'] =
      event.target.value / items.find((it: any) => it === props.item)['quantity']
    }

    props.setInvoice({
      ...props.invoice,
      items: items,
    });
  };

  const handleDeleteItem = () => {
    let invoice = props.invoice;
    let item = invoice.items.find((it: any) => it === props.item);
    let itemIndex = invoice.items.indexOf(item);
    let items = invoice.items
      .slice(undefined, itemIndex)
      .concat(invoice.items.slice(itemIndex + 1, undefined));
    props.setInvoice({
      ...props.invoice,
      items: items,
    });
  };

  return (
    <Card sx={{backgroundColor: '#F3F5F8', my: 3, py: 3, boxShadow: 'none'}}>
      <Grid container spacing={2} mt={1} columns={11}>
        <Grid item={true} xs={12} sm={3}>
          <Stack>
          <InputLabel id="Title-label" sx={{ color: 'primary.main', width: "100%" }}>
            Title
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
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={props.item.title ? props.item.title : ''}
            onChange={handleChange}
            size="small"
          />
          </Stack>
        </Grid>
        <Grid item={true} xs={12} sm={2}></Grid>
        <Grid item={true} xs={12} sm={2}>
          <Stack>
            <InputLabel id="price-label" sx={{ color: 'primary.main' }}>
              Unit $
            </InputLabel>
            <TextField
              id="unit"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                     <AttachMoney color='primary' />
                  </InputAdornment>
                ),
              }}
              value={props.item.unit ? props.item.unit : ''}
              onChange={handleChange}
              size="small"
            />
          </Stack>
        </Grid>
        <Grid item={true} xs={12} sm={2}>
          <Stack>
            <InputLabel id="price-label" sx={{ color: 'primary.main' }}>
              Qty
            </InputLabel>
            <TextField
              id="quantity"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                     <Numbers color='primary' />
                  </InputAdornment>
                ),
              }}
              value={props.item.quantity ? props.item.quantity : ''}
              onChange={handleChange}
              size="small"
            />
          </Stack>
        </Grid>
        <Grid item={true} xs={12} sm={2}>
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
        {props.invoice.items.length > 1 && 
          <Button
          onClick={handleDeleteItem}
          startIcon={<DeleteOutline color="error" />}
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

function InvoiceDetails(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [editting, setEditting] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const [sendOpen, setSendOpen] = useState(false);
  const [payment, setPayment] = useState({} as any);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [type, setType] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [taxOpen, setTaxOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);


  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleTaxClose = () => {
    setTaxOpen(false);
  };

  const handleBillingClose = () => {
    setBillingOpen(false);
  };

  const handleBillingOpen = () => {
    setBillingOpen(true);
  }

  const handleTaxOpen = () => {
    setTaxOpen(true);
  };

  const handleEditting = () => {
    if (editting) {
      setLoading(true);
      updateInvoice(props.invoice).then(
        (res) => {
          setLoading(false);
          props.success('Successfully updated invoice');
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

  const handleAddItem = () => {
    let items = props.invoice.items;
    items.push({ price: 0, unit: 0, quantity: 1 });
    props.setInvoice({
      ...props.invoice,
      items: items,
    });
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
    closeMenu();
  };

  const handleSend = () => {
    setSendOpen(true);
  };

  const handleSendClose = (value: string) => {
    setSendOpen(false);
    setAnchorEl(null);
  };

  const onDelete = () => {
    navigate(`/invoices`);
  };

  const handlePaymentClose = () => {
    setPaymentOpen(false);
    setAnchorEl(null);
  };

  const handleNewPayment = () => {
    setType('new');
    setPayment({
      client: props.invoice.invoice.client,
      type: 'payment',
      typeId: props.invoice.invoice.id,
      details: `Payment for invoice #${props.invoice.invoice.id}`,
      transDate: dayjs(),
      method: 'Cheque',
      amount: ((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)
      - props.payments.map((p: any) => p.amount).reduce(add, 0)).toFixed(2)
    });
    setPaymentOpen(true);
  };

  const handleEditPayment = (event: any, currPayment: any) => {
    if (currPayment.method === 'Credit Card') {
      return;
    }
    setType('edit');
    setPayment(currPayment);
    setPaymentOpen(true);
  };

  const markInvoiceAs = (status: string) => {
    closeMenu();
    props.invoice.invoice.status = status;
    updateInvoice(props.invoice).then(
      (res) => {
        let timeline_event = {
          client: props.invoice.invoice.client,
          resourceId: props.invoice.invoice.id,
          resourceType: 'invoice',
          resourceAction: status.toLowerCase()
        };
        createTimeline(timeline_event);
        props.success('Status updated successfully');
      },
      (err) => {}
    );
  };

  const handleChangeTax = (event: any) => {
    let invoiceWithTax = props.invoice.invoice;
    invoiceWithTax.tax = event.target.value.id;
    props.setInvoice({
      ...props.invoice,
      invoice: invoiceWithTax,
    });
  };


  const handleDownload = () => {
    setLoading(true);
    downloadInvoice(props.invoice.invoice.id)
    .then(res => {
      const url = window.URL.createObjectURL(res as Blob);
      window.open(url);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    })
  }

  const handlePreview = () => {
    window.open(`${process.env.REACT_APP_URL}/client-hub/${props.invoice.invoice.client}/invoices/${props.invoice.invoice.id}`)
  }

  function getActionButtons(props: any) {

    if (mobile) {
      return (
        <Chip label={props.invoice.invoice.status}  sx={{backgroundColor: `${getChipColor(props.invoice.invoice.status as string)}.main`, color: `${getChipColor(props.invoice.invoice.status as string)}.dark`}}  />
        )
    }

    if (props.invoice.invoice.status === 'Draft') {
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
        onClick={() => markInvoiceAs('Awaiting Payment')}
        >
          Mark as sent
        </Button>
        </>
      )
    }
    
    if (props.invoice.invoice.status === 'Awaiting Payment' && (props.payments.map((p: any) => p.amount).reduce(add, 0) < 
    ((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)))
    ) {
      return (
        <>
        <Button
        variant="contained"
        color="primary"
        onClick={handleNewPayment}
        >
          Collect Payment
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        >
          Send
        </Button>
        </>
      )
    }
    if (props.invoice.invoice.status === 'Paid') {
      return (<></>);
    }
    if (props.invoice.invoice.status === 'Bad Debt') {
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
            {`Invoice #${props.invoice.invoice.id}`}
          </Typography>
          {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
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
              {props.invoice.invoice.status === 'Draft' &&
                <MenuItem onClick={() => markInvoiceAs('Awaiting Payment')}>
                  <ListItemIcon>
                    <MarkEmailReadOutlined />
                  </ListItemIcon>
                  <ListItemText>Mark as Sent</ListItemText>
              </MenuItem>
              }
              {props.invoice.invoice.status === 'Awaiting Payment' && 
                <MenuItem onClick={() => markInvoiceAs('Bad Debt')}>
                  <ListItemIcon>
                    <MoneyOffOutlined />
                  </ListItemIcon>
                  <ListItemText>Mark as Bad Debt</ListItemText>
                </MenuItem>
              }
              {props.invoice.invoice.status !== 'Paid' && props.invoice.invoice.status !== 'Draft' &&
              <MenuItem onClick={handleNewPayment}>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText>Collect Payment</ListItemText>
              </MenuItem>
              }
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
              <MenuItem onClick={handleDeleteOpen}>
                <ListItemIcon>
                  <DeleteOutline color="error" />
                </ListItemIcon>
                <ListItemText>Delete invoice</ListItemText>
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
            {dayjs(props.invoice.invoice.created).format("MM/DD/YYYY")}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Opened
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
              From
            </Typography>
            {props.invoice.invoice.job ? (
              <Link
                sx={{ textAlign: 'center' }}
                href={`/jobs/${props.invoice.invoice.job}`}
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
            <Chip label={props.invoice.invoice.status}  sx={{backgroundColor: `${getChipColor(props.invoice.invoice.status as string)}.main`, color: `${getChipColor(props.invoice.invoice.status as string)}.dark`}}  />
          </Stack>
          }
        </Stack>
      </Card>
      <Card sx={{ py: 3 }}>
        {loading && <LinearProgress />}
        <Stack
          direction={mobile ? "column" : 'row'}
          alignItems="center"
          justifyContent="space-between"
        >
        <Grid container>
          <Grid item xs={11} lg={4}>
            <Stack direction={'row'} alignItems="baseline">
              <IconButton onClick={handleBillingOpen}>
                <Edit color='primary'/>
              </IconButton>
              <Stack>
                <Typography fontWeight={700} >Billing Address</Typography>
                <Typography>{props.invoice.invoice.address} {props.invoice.invoice.address2}</Typography>
                <Typography>{props.invoice.invoice.city}{props.invoice.invoice.city && props.invoice.invoice.state ? ',' : ''} {props.invoice.invoice.state}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
          {(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner') &&
          <>
          {editting ? (
            <Stack direction="row" spacing={2}>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleEditting} variant="contained">
                Save Changes
              </Button>
            </Stack>
          ) : (
            <Button onClick={handleEditting} variant="contained">
              Edit Invoice
            </Button>
          )}
          </>
          }
        </Stack>
        <Divider sx={{ mt: 3, mb: 1 }} />
        {editting && (
          <>
            {props.invoice.items.map((item: any, index: number) => (
              <InvoiceItemEdit key={index} item={item} {...props} />
            ))}
            <Stack alignItems="center" my={2}>
              <Button
                onClick={handleAddItem}
                startIcon={<AddCircleOutlineOutlined />}
                variant="contained"
              >
                <Typography>Add Item</Typography>
              </Button>
            </Stack>
            <Divider/>
          </>
        )}
        {!editting && (
          <>
            {props.invoice.items.map((item: any, index: number) => (
              <InvoiceItemSaved key={index} item={item} {...props} />
            ))}
            {props.invoice?.items?.length === 0 && (
              <EmptyState type="invoice-items" />
            )}
          </>
        )}
        <Stack mt={2.5} spacing={2}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8} sm={6}>
              <Grid container>
                <Grid item xs={5}>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    Subtotal
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="neutral.main"
                  >
                    $
                    {(props.invoice.items
                      .map((i: any) => i.price)
                      .reduce(add, 0)).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8} sm={6}>
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
                  {editting ? (
                    <Select
                      labelId="tax-label"
                      id="tax"
                      value={props.taxes.find(
                        (t: any) => t.id === props.invoice.invoice.tax
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
                      <MenuItem key={'goto-tax'} onClick={handleTaxOpen}>
                          <ListItemText primary={'Add Tax'} />
                      </MenuItem>
                      {props.taxes.map((tax: any) => (
                        <MenuItem key={tax.id} value={tax}>
                          <Checkbox
                            checked={tax.id === props.invoice.invoice.tax}
                          />
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
                      {(+(
                        props.taxes.find(
                          (t: any) => t.id === props.invoice.invoice.tax
                        )?.tax ?? 0
                      ) *
                        props.invoice.items
                          .map((i: any) => i.price)
                          .reduce(add, 0)).toFixed(2)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
              <Grid item xs={8} sm={6}>
                <Divider sx={{ width: '100%' }} />
              </Grid>
            </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8} sm={6}>
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
                    $
                    {((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8} sm={6}>
              <Grid container>
                <Grid item xs={5}>
                  <Typography variant="body2" color="neutral.light" fontWeight={600}>
                    Balance
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="neutral.main"
                  >
                    $
                    {((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)
                    - props.payments.map((p: any) => p.amount).reduce(add, 0)).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
        {props.payments.length > 0 && (
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
                      onClick={(e) => handleEditPayment(e, payment)}
                      
                    >
                        <Grid container justifyContent="flex-end">
                        <Grid item xs={8} sm={6}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={5}>
                              <Typography
                                variant="body2"
                                color="neutral.light"
                                fontWeight={500}
                              >
                                {`${payment.type} ${dayjs(payment.transDate).format('MMM D')}`}
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
                                  ${(+payment?.amount).toFixed(2)}
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
          type={'invoices'}
          deleteId={props.invoice.invoice.id}
          onDelete={onDelete}
          success={props.success}
        />
        <SendInvoiceModal
          open={sendOpen}
          onClose={handleSendClose}
          type={'Invoice'}
          invoice={props.invoice}
          success={props.success}
          settings={props.settings}
        />
        <PaymentModal
          payment={payment}
          setPayment={setPayment}
          open={paymentOpen}
          onClose={handlePaymentClose}
          paymentType={'Payment'}
          type={type}
          success={props.success}
          invoice={props.invoice}
          reload={props.reload}
          setReload={props.setReload}
        />
        <TaxModal
          open={taxOpen}
          onClose={handleTaxClose}
          success={props.success}
        />
        <BillingAddress
          open={billingOpen}
          onClose={handleBillingClose}
          success={props.success}
          invoice={props.invoice}
          setInvoice={props.setInvoice}
          setLoading={setLoading}
        />
      </Card>
    </Stack>
  );
}

export default InvoiceDetails;
