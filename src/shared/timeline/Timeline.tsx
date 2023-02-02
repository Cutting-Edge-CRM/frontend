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
        <Typography fontWeight={600} fontSize={18}>
          Timeline
        </Typography>
      </Stack>
      {loading && <Box textAlign='center'><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List>
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
                      {event.resourceType?.charAt(0).toUpperCase() + event.resourceType?.slice(1)} #{event.resourceId} was {event.resourceAction}
                    </Typography>
                    <Typography
                      color="primary"
                      variant="caption"
                      fontWeight={500}
                    >
                      {dayjs(event.created).format('MM/DD/YYYY')}
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
