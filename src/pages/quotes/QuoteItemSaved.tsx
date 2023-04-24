import React, {  } from 'react';
import { Grid, Stack, Typography, Switch, Divider } from "@mui/material";
import { isAllowed } from "../../auth/FeatureGuards";

function QuoteItemSaved(props: any) {
    return (
      <>
        <Grid container spacing={2} marginTop={2} columns={10}>
          <Grid item={true} xs={2}>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="neutral.light" fontWeight={500}>
                {props.item.note ? "Note" : "Line Item"}
              </Typography>
              <Typography variant="body2" color="neutral.main" fontWeight={600}>
                {props.item.title}
              </Typography>
            </Stack>
          </Grid>
          {!props.item.note &&
          <>
          <Grid item={true} xs={2}>
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
          <Grid item={true} xs={2}>
            <Stack spacing={1.5} alignItems="center">
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.light"
                fontWeight={500}
              >
                Unit $
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.main"
                fontWeight={600}
              >
                {isAllowed('view-pricing') ? <>${(+props.item.unit)?.toFixed(2)}</> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>}
              </Typography>
            </Stack>
          </Grid>
          <Grid item={true} xs={2}>
            <Stack spacing={1.5} alignItems="center">
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.light"
                fontWeight={500}
              >
                {props.item.customQuantity ?? "Qty"}
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.main"
                fontWeight={600}
              >
                {isAllowed('view-pricing') ? <>{(+props.item.quantity)?.toFixed(2)}</> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>}
              </Typography>
            </Stack>
          </Grid>
          <Grid item={true} xs={2}>
            <Stack spacing={1.5} alignItems="flex-end">
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.light"
                fontWeight={500}
              >
                Price
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                color="neutral.main"
                fontWeight={600}
              >
                {isAllowed('view-pricing') ? <>${(+props.item.price)?.toFixed(2)}</> : <Typography fontStyle={'italic'} fontWeight={300}>hidden</Typography>}
              </Typography>
            </Stack>
          </Grid>
          </>
          }
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

export default QuoteItemSaved;
