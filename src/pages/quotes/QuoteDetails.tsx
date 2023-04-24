import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { useMediaQuery, Box, Stack, Button, Typography, Tooltip, Divider, Grid, Select, MenuItem, ListItemText, Checkbox, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { isAllowed } from '../../auth/FeatureGuards';
import EmptyState from '../../shared/EmptyState';
import TaxModal from '../../shared/TaxModal';
import { theme } from '../../theme/theme';
import QuoteItemEdit from './QuoteItemEdit';
import QuoteItemSaved from './QuoteItemSaved';

function add(accumulator: any, a: any) {
    return +accumulator + +a;
  }

function QuoteDetails(props: any) {
    const [depositAmount, setDepositAmount] = useState(0);
    // eslint-disable-next-line
    const [taxAmount, setTaxAmount] = useState(0);
    const [subTotalAmount, setSubtotalAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [taxOpen, setTaxOpen] = useState(false);
    const [taxGroup, setTaxGroup] = useState({} as any);
    let mobile = useMediaQuery(theme.breakpoints.down("sm"));
  
    const handleChangeDeposit = (event: any) => {
      if (event.target.value[0] === '0') {
        event.target.value = event.target.value[1];
      }
      if (event.target.value === '') {
        event.target.value = 0;
      }
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
  
    const handleTaxClose = () => {
      setTaxOpen(false);
    };
  
    const handleTaxOpen = () => {
      setTaxGroup({title: "", taxes: [{title: "", tax: ""}]});
      setTaxOpen(true);
    };
  
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
  
    const handleAddItem = () => {
      let options = props.quote.options;
      let items = props.option.items;
      items.push({ price: 0, unit: 0, quantity: 1 });
      options.find((op: any) => op === props.option).items = items;
      props.setQuote({
        quote: props.quote.quote,
        options: options,
      });
    };
  
    const handleAddUpsell = () => {
      let options = props.quote.options;
      let items = props.option.items;
      items.push({ price: 0, addon: 1, unit: 0, quantity: 1 });
      options.find((op: any) => op === props.option).items = items;
      props.setQuote({
        quote: props.quote.quote,
        options: options,
      });
    };
  
    const handleAddText = () => {
      let options = props.quote.options;
      let items = props.option.items;
      items.push({ price: 0, addon: 0, unit: 0, quantity: 1, note: true });
      options.find((op: any) => op === props.option).items = items;
      props.setQuote({
        quote: props.quote.quote,
        options: options,
      });
    }
  
    return (
      <Box
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`option-${props.index}`}
        paddingX={useMediaQuery(theme.breakpoints.down("sm")) ? 0 : 4}
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
                  direction={mobile ? 'column' : 'row'}
                  justifyContent="center"
                  spacing={4}
                  mb={2}
                >
                  <Button
                    onClick={handleAddItem}
                    startIcon={<AddCircleOutlineOutlined />}
                    variant="contained"
                  >
                    <Typography>Add Item</Typography>
                  </Button>
                  <Tooltip title='Optional items allow clients to select or unselect the line item'>
                    <Button
                      onClick={handleAddUpsell}
                      startIcon={<AddCircleOutlineOutlined />}
                      variant="contained"
                    >
                      <Typography>Add Optional Item</Typography>
                    </Button>
                  </Tooltip>
                  <Tooltip title='Add a line item containing only text to add context or more information.'>
                    <Button
                      onClick={handleAddText}
                      startIcon={<AddCircleOutlineOutlined />}
                      variant="contained"
                    >
                      <Typography>Add Text</Typography>
                    </Button>
                  </Tooltip>
                </Stack>
                <Divider/>
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
            {isAllowed('view-pricing') && 
            <Stack mt={2.5} spacing={2}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={6}>
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
                        ${subTotalAmount?.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={5}>
                      <>
                        {props.taxes.find((t: any) => t.id === props.option.tax)?.taxes?.map((t: any, index: number) => (
                          <Typography
                          variant="body2"
                          color="neutral.light"
                          fontWeight={500}
                          key={index}
                          >
                            {t.title}
                          </Typography>
                        ))}
                        </>
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
                          <MenuItem key={'goto-tax'} onClick={handleTaxOpen}>
                              <ListItemText primary={'Add Tax'} />
                          </MenuItem>
                          {props.taxes.map((tax: any) => (
                            <MenuItem key={tax.id} value={tax}>
                              <Checkbox checked={tax.id === props.option.tax} />
                              <ListItemText primary={tax.title} />
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <>
                        {props.taxes.find((t: any) => t.id === props.option.tax)?.taxes?.map((t: any, index: number) => (
                          <Typography
                          key={index}
                          variant="body2"
                          fontWeight={600}
                          color="neutral.main"
                        >
                          {((+t.tax/100)*subTotalAmount)?.toFixed(2)}
                        </Typography>
                        ))}
                        </>
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
                        ${totalAmount?.toFixed(2)}
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
                          ${(+depositAmount)?.toFixed(2)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            }
          </>
        )}
        <TaxModal
            open={taxOpen}
            onClose={handleTaxClose}
            success={props.success}
            taxGroup={taxGroup}
            setTaxGroup={setTaxGroup}
            taxModalType={"New"}
            setReload={props.setReload} 
            reload={props.reload}
          />
      </Box>
    );
  }


  export default QuoteDetails;