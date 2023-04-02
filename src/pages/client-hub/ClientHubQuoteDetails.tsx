import { FileDownload } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    List,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    useMediaQuery,
  } from '@mui/material';
  import dayjs from 'dayjs';
  import React, { useEffect, useState } from 'react';
import { downloadQuote } from '../../api/quote.api';
  import EmptyState from '../../shared/EmptyState';
import { getChipColor, theme } from '../../theme/theme';
import ConfirmChangeStatus from './ConfirmChangeStatus';
import PaymentModal from './PaymentModal';
  
  function add(accumulator: any, a: any) {
    return +accumulator + +a;
  }
  
  function QuoteItemSaved(props: any) {

    const handleCheck = (event: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.checked ? 1 : 0;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      };

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
                  Include
                </Typography>
                <Switch
                disabled={props.quote.quote.status !== 'Pending'}
                id='selected' 
                checked={props.item.selected === 1} 
                onChange={handleCheck}></Switch>
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
  
  function TabPanel(props: any) {
    const [depositAmount, setDepositAmount] = useState(0);
    // eslint-disable-next-line
    const [taxAmount, setTaxAmount] = useState(0);
    const [subTotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  
    useEffect(() => {
      setSubtotalAmount(
        props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
      );
      setTaxAmount(
        +props.taxes.find((t: any) => t.id === props.option.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
          props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
      );
      setTotalAmount(
        props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
          +props.taxes.find((t: any) => t.id === props.option.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
            props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0)
      );
      setDepositAmount(
        props.option.depositPercent
          ? (+props.option.deposit / 100) *
              (props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
                +props.taxes.find((t: any) => t.id === props.option.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
                  props.option.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
          : props.option.deposit
      );
    }, [props]);
  
  
    return (
      <Box
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`option-${props.index}`}
        paddingX={mobile ? 1 : 4}
        marginTop={3}
      >
        {props.value === props.index && (
          <>
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
            <Stack mt={2.5} spacing={2}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={4}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={600}
                      >
                        Subtotal
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                <Grid item xs={8} sm={4}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        color="neutral.light"
                        fontWeight={500}
                      >
                        Deposit
                      </Typography>
                    </Grid>
  
                    <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="neutral.main"
                        >
                          ${depositAmount.toFixed(2)}
                        </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={4}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <>
                        {props.taxes.find((t: any) => t.id === props.option.tax)?.taxes?.map((t: any) => (
                          <Typography
                          variant="body2"
                          color="neutral.light"
                          fontWeight={500}
                          key={t.id}
                          >
                            {t.title}
                          </Typography>
                        ))}
                      </>
                    </Grid>
                    <Grid item xs={6}>
                      <>
                        {props.taxes.find((t: any) => t.id === props.option.tax)?.taxes?.map((t: any) => (
                          <Typography
                          key={t.id}
                          variant="body2"
                          fontWeight={600}
                          color="neutral.main"
                        >
                          {((+t.tax/100)*subTotalAmount)?.toFixed(2)}
                        </Typography>
                        ))}
                      </>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={4}>
                  <Divider sx={{ width: '100%' }} />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={4}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        Total
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
  
  function ClientHubQuoteDetails(props: any) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState('');
    const [paymentOpen, setPaymentOpen] = useState(false);
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);

    const handleConfirmOpen = (status: string) => {
        setConfirmType(status);
        setConfirmOpen(true);
    };

    const handleConfirmClose = (value: string) => {
        setConfirmOpen(false);
    };

    const handlePaymentClose = (value: string) => {
        setPaymentOpen(false);
    };

    const handleOpenPayment = () => {
        setPaymentOpen(true);
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

    return (
      <Stack spacing={2}>
        <Card sx={{ pb: 4, pt: 1 }}>
        {loading && <LinearProgress/>}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
          >
            <Typography variant="h6" fontWeight={600}>
              {`Quote #${props.quote.quote.id}`}
            </Typography>
            {mobile && <Chip label={props.quote.quote.status}  sx={{backgroundColor: `${getChipColor(props.quote.quote.status as string)}.main`, color: `${getChipColor(props.quote.quote.status as string)}.dark`}}  />}
            {!mobile && 
              <IconButton onClick={handleDownload}>
                <FileDownload/>
              </IconButton>
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
                Client
              </Typography>
              <Typography textAlign="center" variant="body2">
                {props.client.first} {props.client.last}
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                textAlign="center"
                variant="body2"
                fontWeight={500}
                color="neutral.light"
              >
                Sent
              </Typography>
              <Typography textAlign="center" variant="body2">
                {dayjs(props.sent).format("MM/DD/YYYY")}
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
                {props.opened ? dayjs(props.opened).format("MM/DD/YYYY") : '-'}
              </Typography>
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
                <Chip label={props.quote.quote.status} sx={{backgroundColor: `${getChipColor(props.quote.quote.status as string)}.main`, color: `${getChipColor(props.quote.quote.status as string)}.dark`}} />
              </Stack>
            }
          </Stack>
        </Card>
        <Card sx={{ py: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={600}>
              Quote Details
            </Typography>
          </Stack>
            <TabPanel
              option={props.quote.options?.[0]}
              {...props}
            />
          {props.payments.length > 0 && (
                <Stack mt={2.5} spacing={2}>
                  <Grid container justifyContent={'end'}>
                    <Grid item xs={8} sm={3} >
                      <Typography variant="h6" color="primary" fontWeight={500}>Payments</Typography>
                    </Grid>
                  </Grid>
                  <List>
                    {props.payments.map((payment: any) => (
                          <Grid container justifyContent="flex-end" key={payment.id}>
                          <Grid item xs={8} sm={4}>
                            <Grid container alignItems="center" spacing={2}>
                              <Grid item xs={8}>
                                <Typography
                                  variant="body2"
                                  color="neutral.light"
                                  fontWeight={500}
                                  textAlign={'right'}
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
                    ))}
                  </List>
                </Stack>
          )}
          <Box display={'flex'} justifyContent='end'>
          {props.quote.quote.status === 'Pending' && 
            <>
                <Button
                sx={{margin: 5}}
                variant='contained'
                onClick={() => handleConfirmOpen('Rejected')}
                >Reject
                </Button>
                <Button
                sx={{margin: 5}}
                variant='contained'
                onClick={() => handleConfirmOpen('Approved')}
                >Approve
                </Button>
            </>
                }
            {props.quote.quote.status === 'Approved' && props.quote.options?.[0]?.deposit  && (props.payments.map((p: any) => p.amount).reduce(add, 0) < 
            (props.quote.options?.[0]?.depositPercent
            ? (+props.quote.options?.[0]?.deposit / 100) *
                (props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) +
                    +props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100 *
                    props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))
            : props.quote.options?.[0]?.deposit)) && props.paymentsEnabled &&
            <>
                <Button
                sx={{margin: 5}}
                variant='contained'
                onClick={handleOpenPayment}
                >Pay Deposit
                </Button>
            </>
                }
          </Box>
        </Card>

            <ConfirmChangeStatus
            open={confirmOpen}
            onClose={handleConfirmClose}
            type={confirmType}
            price={(props.quote.options?.[0].items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.quote.options?.[0].tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100)*(props.quote.options?.[0].items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))).toFixed(2)}
            success={props.success}
            {...props}
            />
            <PaymentModal
            open={paymentOpen}
            onClose={handlePaymentClose}
            success={props.success}
            quote={props.quote}
            type='deposit'
            amount={(props.quote.options?.[0]?.depositPercent ? (+props.quote.options?.[0]?.deposit/100)*(props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0) + (+props.taxes.find((t: any) => t.id === props.quote.options?.[0]?.tax)?.taxes.map((t: any) => t.tax).reduce(add, 0)/100)*(props.quote.options?.[0]?.items.filter((i: any) => !i.addon || !!i.selected).map((i: any) => i.price).reduce(add, 0))) : props.quote.options?.[0]?.deposit).toFixed(2)}
            />
      </Stack>
    );
  }
  
  export default ClientHubQuoteDetails;
  