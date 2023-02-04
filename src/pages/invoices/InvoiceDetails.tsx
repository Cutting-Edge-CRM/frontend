import {
  AddCircleOutlineOutlined,
  AttachMoney,
  DeleteOutline,
  FileDownloadOutlined,
  MarkEmailReadOutlined,
  MoneyOffOutlined,
  MoreVert,
  PersonOutline,
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
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateInvoice } from '../../api/invoice.api';
import { createTimeline } from '../../api/timeline.api';
import ConfirmDelete from '../../shared/ConfirmDelete';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from '../../shared/PaymentModal';
import RichText from '../../shared/RichText';
import SendInvoiceModal from '../../shared/SendInvoiceModal';

function add(accumulator: number, a: number) {
  return +accumulator + +a;
}

function InvoiceItemSaved(props: any) {
  return (
    <Box sx={{ px: 4 }}>
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
        <Grid item={true} xs={4}></Grid>
        <Grid item={true} xs={4}>
          <Stack spacing={1.5} alignItems="flex-end">
            <Typography variant="body2" color="neutral.light" fontWeight={500}>
              Total
            </Typography>
            <Typography variant="body2" color="neutral.main" fontWeight={600}>
              ${props.item.price}
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
      <Divider />
    </Box>
  );
}

function InvoiceItemEdit(props: any) {
  const handleChange = (event: any) => {
    let items = props.invoice.items;
    items.find((it: any) => it === props.item)[event.target.id] =
      event.target.value;
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
    <>
      <Grid container spacing={2} mt={1}>
        <Grid item={true} xs={4}>
          <TextField
            id="title"
            label="Service"
            error={!props.item.title?.trim()?.length}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline />
                </InputAdornment>
              ),
            }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={props.item.title ? props.item.title : ''}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item={true} xs={4}></Grid>
        <Grid item={true} xs={4}>
          <Stack>
            <TextField
              id="price"
              label="Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
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
        <Typography variant="body2" color="neutral.main">
          Description
        </Typography>
        <RichText
          content={props.item.description ? props.item.description : ''}
          {...props}
          type="invoice"
        />
        {props.invoice.items.length > 1 && 
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
      <Divider sx={{ mt: 3, mb: 1 }} />
    </>
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

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
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
    items.push({ price: 0 });
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
      amount: props.invoice.invoice.depositPercent
        ? (+props.invoice.invoice.deposit / 100) *
          (props.invoice.invoice.items.map((i: any) => i.price).reduce(add, 0) +
            +props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)
              ?.tax *
              props.invoice.invoice.items
                .map((i: any) => i.price)
                .reduce(add, 0))
        : props.invoice.invoice.deposit,
    });
    setPaymentOpen(true);
  };

  const handleEditPayment = (event: any, currPayment: any) => {
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
              <MenuItem onClick={() => markInvoiceAs('Awaiting Payment')}>
                <ListItemIcon>
                  <MarkEmailReadOutlined />
                </ListItemIcon>
                <ListItemText>Mark as Sent</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => markInvoiceAs('Bad Debt')}>
                <ListItemIcon>
                  <MoneyOffOutlined />
                </ListItemIcon>
                <ListItemText>Mark as Bad Debt</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleNewPayment}>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText>Collect Payment</ListItemText>
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
              <MenuItem onClick={handleDeleteOpen}>
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                <ListItemText>Delete invoice</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
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
              Opened
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
          <Stack spacing={1}>
            <Typography
              textAlign="center"
              variant="body2"
              fontWeight={500}
              color="neutral.light"
            >
              Status
            </Typography>
            <Chip label={props.invoice.invoice.status} color="primary" />
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
            Invoice Details
          </Typography>
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
              >
                <Typography>Add Item</Typography>
              </Button>
            </Stack>
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
            <Grid item xs={4}>
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
                    {props.invoice.items
                      .map((i: any) => i.price)
                      .reduce(add, 0)}
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
                      {+(
                        props.taxes.find(
                          (t: any) => t.id === props.invoice.invoice.tax
                        )?.tax ?? 0
                      ) *
                        props.invoice.items
                          .map((i: any) => i.price)
                          .reduce(add, 0)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={5}>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="neutral.main"
                  >
                    $
                    {(+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
        {props.payments.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack>
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <List>
                    {props.payments.map((payment: any) => (
                      <ListItemButton
                        key={payment.id}
                        id={payment.id}
                        onClick={(e) => handleEditPayment(e, payment)}
                      >
                        <Stack direction={'row'} spacing={5}>
                          <Typography variant="body1" color="neutral.main">{`${payment.type} collected ${dayjs(payment.transDate).format('MMM D')}`}</Typography>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="neutral.main"
                          >
                            ${payment.amount}
                          </Typography>
                        </Stack>
                      </ListItemButton>
                    ))}
                  </List>
                </Grid>
              </Grid>
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
        />
      </Card>
    </Stack>
  );
}

export default InvoiceDetails;
