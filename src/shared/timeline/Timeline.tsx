import { History } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { listTimeline } from '../../api/timeline.api';
import EmptyState from '../EmptyState';

function Timeline(props: any) {
  const [rows, setRows] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getTimelineWording(event: any) {
    switch (event.resourceAction) {
      case 'converted':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was converted to job`)
      case 'pending':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was marked as pending`)
      case 'client-approved':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was approved by client`)
      case 'client-rejected':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was rejected by client`)
      case 'opened':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was opened by client`)
      case 'client-created':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was made by client`)
      case 'created':
        if (event.resourceType === 'payment') return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was recorded`)
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was ${event.resourceAction}`)
      case 'complete':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was marked as complete`)
      case 'awaiting payment':
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was marked as awaiting payment`)
      default:
        return (`${event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #${event.resourceId} was ${event.resourceAction}`)
    }
  }

  useEffect(() => {
    listTimeline(props.client, props.resourceType, props.resourceId).then(
      (result) => {
        setRows(result);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  }, [props]);

  return (
    <Card sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={600} fontSize={18} marginBottom={1}>
          Timeline
        </Typography>
      </Stack>
      {loading && <Box textAlign='center'><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List sx={{
          overflow: 'auto',
          maxHeight: 400,
        }}>
          {rows.map((event: any) => (
            <ListItem
              sx={{
                backgroundColor: 'default.light',
                borderRadius: '10px',
                mt: 2,
                paddingRight: 0,
                pt: 2,
                pb: 2,
              }}
              key={event.id}
            >
              <Grid container spacing={2}>
                <Grid item={true} xs={2} alignSelf="center">
                  <History sx={{color: 'default.dark'}} />
                </Grid>
                <Grid item={true} xs={8}>
                  <Stack>
                    <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ opacity: 0.7 }}
                    >
                      {getTimelineWording(event)}
                    </Typography>
                    <Typography
                      color="primary"
                      variant="caption"
                      fontWeight={500}
                    >
                      {dayjs(event.created).format('MM/DD/YYYY h:mm a')}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  item={true}
                  xs={2}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                </Grid>
              </Grid>
              
            </ListItem>
          ))}
          {rows.length === 0 && (
            <EmptyState type="timeline"/>
          )}
        </List>
      )}
    </Card>
  );
}

export default Timeline;
