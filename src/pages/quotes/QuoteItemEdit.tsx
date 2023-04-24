import { FormatPaintOutlined, AttachMoney, Numbers, DeleteOutline } from '@mui/icons-material';
import { Card, Grid, Stack, InputLabel, TextField, InputAdornment, Switch, Button } from '@mui/material';
import React, {  } from 'react';
import RichText from '../../shared/richtext/RichText';


function QuoteItemEdit(props: any) {
    const handleChange = (event: any) => {
      let options = props.quote.options;
      let quantity = options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)?.quantity;
      let unit = options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)?.unit;
  
      if (event.target.id === 'quantity') {
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['price'] = event.target.value * unit;
        if (unit === '0') {
          options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['price'] = '0';
        }
      }
  
      if (event.target.id === 'unit') {
        if (event.target.value[0] === '0') {
          event.target.value = event.target.value[1];
        }
        if (event.target.value === '') {
          event.target.value = 0;
        }
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['price'] = event.target.value * quantity;
        if (event.target.value === '0') {
          options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['price'] = '0';
        }
      }
      if (event.target.id === 'price') {
        if (event.target.value[0] === '0') {
          event.target.value = event.target.value[1];
        }
        if (event.target.value === '') {
          event.target.value = 0;
        }
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['unit'] = event.target.value / quantity;
        if (event.target.value === '0') {
          options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)['unit'] = '0';
        }
      }
      if (event.target.id === 'customQuantity') {
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
      } else {
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)[event.target.id] = event.target.value;
      }
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
        <Grid container spacing={2} columns={11}>
          <Grid item={true} xs={12} sm={3}>
          <Stack alignItems="center">
            <InputLabel id="Title-label" sx={{ color: 'primary.main', width: "100%" }}>
              {props.item.note ? "Note" : "Line Item"}
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
            </Stack>
          </Grid>
          {!props.item.note &&
          <>
          <Grid item={true} xs={12} sm={2} order={{ xs: 3, sm: 2 }}>
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
          <Grid item={true} xs={12} sm={2} order={{ xs: 2, sm: 3 }}>
            <Stack alignItems="center" spacing={1}>
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
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={props.item.unit ? props.item.unit : ''}
                onChange={handleChange}
                size="small"
              />
            </Stack>
          </Grid>
          <Grid item={true} xs={12} sm={2} order={{ xs: 2, sm: 3 }}>
            <Stack alignItems="center" spacing={1}>
              <TextField
                sx={{'.MuiInputBase-input': {padding: '0px !important', backgroundColor: 'transparent', color: '#0C8BE7', textAlign: 'center'}}}
                id="customQuantity"
                value={props.item.customQuantity ?? 'Qty'}
                onChange={handleChange}
              >
              </TextField>
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
                error={+(props.quote.options.find((op: any) => op === props.option).items.find((it: any) => it === props.item)?.quantity) < 1}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={props.item.quantity ? props.item.quantity : ''}
                onChange={handleChange}
                size="small"
              />
            </Stack>
          </Grid>
          <Grid item={true} xs={12} sm={2} order={{ xs: 2, sm: 3 }}>
            <Stack alignItems="center" spacing={1}>
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
          </>
          }
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

export default QuoteItemEdit;