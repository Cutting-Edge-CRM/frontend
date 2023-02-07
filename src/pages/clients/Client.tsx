import React, { useState } from 'react';
import TabbedSummary from './TabbedSummary';
import Properties from '../../shared/property/Properties';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Visits from '../../shared/visit/Visits';
import Notes from '../../shared/note/Notes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ConfirmDelete from '../../shared/ConfirmDelete';
import Timeline from '../../shared/timeline/Timeline';

function Client(props: any) {
  let { id } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    navigate('/clients');
  };

  const handleDeleteClose = (value: string) => {
    setDeleteOpen(false);
  };

  return (
    <>
    <Grid container spacing={2}>
      <Grid xs={12} md={8} container spacing={2}>
          <Grid xs={12}>
            <Properties type="client" client={id} success={props.success} />
          </Grid>
          <Grid xs={12}>
            <TabbedSummary client={id} success={props.success} />
          </Grid>
      </Grid>
      <Grid xs={12} md={4} spacing={2}>
      <Grid container>
        <Grid xs={12}>
          <Contact client={id} success={props.success} />
        </Grid>
        <Grid xs={12}>
          <Visits client={id} success={props.success} />
        </Grid>
        <Grid xs={12} sm={6} md={12}>
          <Timeline client={id}/>
        </Grid>
        <Grid xs={12} sm={6} md={12}>
          <Notes client={id} success={props.success} />
        </Grid>
        </Grid>
      </Grid>
      <ConfirmDelete
        open={deleteOpen}
        onClose={handleDeleteClose}
        onDelete={handleDelete}
        type={'clients'}
        deleteId={id}
        success={props.success}
      />
    </Grid>
    <Button
    onClick={handleDeleteOpen}
    color="error"
    sx={{ alignSelf: 'flex-start', mt: 3 }}
    >
    Delete Client
  </Button>
  </>
  );
}

export default Client;
